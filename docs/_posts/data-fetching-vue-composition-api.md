---
title: Data Fetching using Vue Hooks
description:
  Learn about data fetching using vue hooks, and how to use swrv, a
  stale-while-revalidate data fetching library for the vue composition api.
date: '2020-02-10T16:16:50.338Z'
layout: Post
tags: [vue, swrv, 'data fetching', 'vue composition api']
image: https://guuu.s3.amazonaws.com/swrv.png
---

::: slot header

# {{ this.$page.title }}

:::

<img :src="$page.frontmatter.image" />

<em>I discuss data fetching in Vue - where it stands today, and how a library
like [swrv](https://github.com/Kong/swrv) can solve some common problems
utilizing stale-while-revalidate caching.</em>

Data fetching in an app can be a bit convoluted. If you're making XHR requests,
you might see low latency from your high speed network connection or your low
latency local network. You can emulate network conditions, but optimizing for
speed can be an afterthought. While you want to empathize with your user base,
implementing a frontend caching layer to speedup data fetches is usually low
priority, especially if you reason that most of your users have high-speed
connections / powerful devices.

## Fetching Data in Vue

Traditionally in [Vue](http://vuejs.org/), you might fetch your data in the
mounted hook, sometimes called "render then fetch"

```vue
<template>
  <div :key="user.username" v-for="user in users">
    {{ user.username }}
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      users: []
    }
  },
  mounted() {
    fetch('/api/users')
      .then(res => res.json())
      .then(myJson => {
        this.users = myJson
      })
  }
}
</script>
```

There are many options now in how a developer might go about
[fetching data](https://sergiodxa.com/articles/render-as-you-fetch/), so even if
you are triggering a fetch at different points in the render
[lifecycle](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram), your
application typically will be constrained by the eventual **inconsitent and
cascading network latency**.

For example if we also want to show all users with a link to their profile, e.g.
a `<UserProfile>` component, the profile page will then need to fetch data from
**both** the user and the user profile endpoints.

<p class="bigger-image">
  <img alt="vue data fetching for a user profile component" src="https://guuu.s3.amazonaws.com/swrv-loading.png"/>
</p>
<em>&lt;UserProfile&gt; component being loaded</em>

This is common in RESTful endpoints when an endpoint doesn't support
[eager relations](https://typeorm.io/#/eager-and-lazy-relations), specify join
fields, or if you are not using [GraphQL](https://graphql.org/learn/queries/)
which is able to specify multiple return entities. The subsequent mounting and
network cost blocking the render could get expensive.

```vue
<template>
  <div v-if="profile">
    <img class="avatar" :src="profile.avatar" />
    <div>{{ profile.user.username }}</div>
    <div>{{ profile.twitter }}</div>
  </div>
  <div v-else>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      profile: null
    }
  },

  mounted() {
    fetch(`/api/user/${this.username}`)
      .then(res => {
        return res.json()
      })
      .then(user => {
        fetch(`/api/user/${user.id}/profile`)
          .then(res => {
            return res.json()
          })
          .then(profile => {
            this.profile = {
              ...profile,
              user
            }
          })
      })
  }
}
</script>
```

This gets a bit ugly and is not reactive in the event that `username` changes.
Let's clean it up a bit with the
[@vue/composition-api](https://vue-composition-api-rfc.netlify.com/) to
[keep the data flowing](https://overreacted.io/writing-resilient-components/#principle-1-dont-stop-the-data-flow)
and utilize the new vue `setup` function.

```vue
<template>
  <div v-if="profile">
    <img class="avatar" :src="profile.avatar" />
    <div>{{ profile.user.username }}</div>
    <div>{{ profile.twitter }}</div>
  </div>
  <div v-else>
    <Loading />
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'

export default {
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const profile = ref([])

    // when props.username changes, vue's reactivity automatically
    // registers the change and re-triggers the data fetch.
    watch(() => {
      fetch(`/api/user/${props.username}`)
        .then(res => res.json())
        .then(user => {
          fetch(`/api/user/${user.id}/profile`)
            .then(res => res.json())
            .then(profile => {
              profile.value = { ...profile, user }
            })
        })
    })

    return {
      profile
    }
  })
}
</script>
```

Now that we have the data _flowing_, there is still a cost to rendering this
component. If a user navigates away, then returns, the component will fetch the
data all over again, even though the user just saw the data! This becomes
frustrating for end users who are at the mercy of their network speeds.

## Caching the Response

Have you ever clicked a "back" link in a web application and the data that you
_just saw_ is now taking an obscene amount of time to refetch? The browser can
sometimes help with
[cache headers](https://tools.ietf.org/html/rfc7234#section-5), and browser
history cache, but in modern applications the server side rendered portion of
our pages are only a segment of a user's navigation lifecycle. We need a
multi-pronged caching strategy so that our dynamic pages, with client-side
fetching, can be consistently fast and always online.<sup>[[1]](#1)</sup>

### Stale-while-revalidate

Stale-while-revalidate (SWR) is a cache invalidation strategy popularized by
HTTP [RFC 5861](https://tools.ietf.org/html/rfc5861).

> If a cached response is served stale due to the presence of this extension,
> the cache SHOULD attempt to revalidate it while still serving stale responses
> (i.e., without blocking).

The key here is "not blocking". In our earlier example, the `<UserProfile>`
component would fetch from `/api/users`, then `/api/users/:id/profile`, always
assuming that new fetches were fresh. This is a good thing, since users always
want to see the latest data. However, this blocked the rendering of data until a
response was received, even if a user had seen the response recently.

A SWR caching strategy would allow users to see stale data **first** while
fetching, giving an
[eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency) UI.

<p class="bigger-image">
  <img alt="stale-while-revalidate data fetching vue" src="https://guuu.s3.amazonaws.com/stale-while-revalidate-data-fetching.png"/>
</p>
<em>
  Profile immediately returns from cache on the left, then once the fetch finishes,
  then the new image/twitter handle is updated.
</em>

In the component, you might want to cache a response in a global store or
localStorage. Here's our component might work:

```js
import { ref, watch } from '@vue/composition-api'

export default {
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props, { root }) {
    const profile = ref([])

    function getFromCache(key) {
      return root.$store.getters['cache/getCacheItem'](key)
    }

    const cacheKey = `${props.username}-profile`

    watch(() => {
      // get STALE content and set data
      profile.value = getFromCache(cacheKey)

      // WHILE-REVALIDATE and go fetch the data anyways,
      // producing immediately cached results, with an
      // eventually consistent UI.
      fetch(`/api/user/${props.username}`)
        .then(res => res.json())
        .then(user => {
          fetch(`/api/user/${user.id}/profile`)
            .then(res =>  res.json())
            .then(profile => {
              profile.value = {
                ...profile,
                user
              }
              root.$store.dispatch('cache/setCacheItem', {
                key: cacheKey,
                profile
              })
            })
          })
        })

      return {
        profile
      }
    })
  }
}
```

This helps us get the strategy correct, but we'd like to have a library do this
for us, so that we can have a simpler api while continuing to add new features:
in-flight de-duplication, library agnostic fetching, error handling, loading
states, different caching strategies, polling, onFocus revalidation etc.

## SWRV

[swrv] (pronounced 'swerve') is a library using
[@vue/composition-api](https://github.com/vuejs/composition-api) hooks for
remote data fetching. It is largely a port of
[swr](https://github.com/zeit/swr). Our example can be refactored:

```js
import fetcher from './fetcher'
import useSWRV from 'swrv'

export default {
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const { data: user, error: error1 } = useSWRV(
      `/api/users/${props.username}`,
      fetcher
    )
    const { data: profile, error: error2 } = useSWRV(
      () => `/api/users/${user.value.id}/profile`,
      fetcher
    )

    return {
      profile
    }
  }
}
```

In this example, the Vue Hook `useSWRV` accepts a key and a fetcher function.
`key` is a unique identifier of the request, and here it is the URL of the API.
The fetcher accepts the `key` as its parameter and returns the data
asynchronously. The `key` can also be a function, with its own dependencies. The
second `useSWRV` hook actually has a dependency on the response from the first
hook. [swrv] will handle this by watching dependencies inside the key function
and re-validate when these change. This is helpful for avoiding unnecessary
fetches, and also reacting to key changes, in the event you'd like to pass in
query params such as pagination/filtering.

`useSWRV` here returns 2 values: `data` and `error`. When the request (fetcher)
is not yet finished, data will be `undefined`. And when we get a response, it
sets `data` and `error` based on the result of fetcher and rerenders the
component. This is because `data` and `error` are Vue
[Refs](https://vue-composition-api-rfc.netlify.com/#detailed-design), and their
values will be set by the fetcher response. The fetcher function can be any
asynchronous function, so you can use your favorite data-fetching library.

### Features

[swrv] handles some of the more complex feature sets, such as:

- in-flight promise **de-duplication** in the event that a page loads the same
  data in multiple components.

<p class="bigger-image">
<img alt="" src="https://guuu.s3.amazonaws.com/swrv-vue-data-fetching.png" />
</p>
<em>Deduplication</em>
  
- focus and page availability revalidation events for when a user switches tabs
  or clicks away during the browser session. This helps with an app feeling
  consistently up to date, or **"alive"**, all while being customizable to what
  the data source requires. e.g. expensive requests might want to limit as many
  fetches as possible.
- **interval polling**, to check if data has been updated, all while still
  serving from cache, and stops polling if user is offline or the window is not
  active.
- **prefetching**, or "warming" the cache - useful for when you anticipate a
  user's actions like hovering over a link or preloading common page data.
- custom **caching** strategies - by default cache is in-memory, but can be
  customized to use `localStorage` for better offline experiences. `swrv`
  manages the cache store, and provides ttl mechanisms for eviction.
- pagination. here is a short demo of using pagination in `swrv`

<iframe src="https://codesandbox.io/embed/swrv-base-69w6y?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

For more information on `swrv` and it's features, check out the
[Github Repository](https://github.com/Kong/swrv).

<div style="font-size: 12px;">
<a id="1" href="https://rauchg.com/2020/2019-in-review">1. Guillermo Rauch -
2019 in Review</a>
</div>

[swrv]: https://github.com/Kong/swrv
