---
title: Vue-autosuggest - slots! 🎰
description: Release of slots api to vue-autosuggest
date: "2018-08-13T17:36:55.338Z"
layout: Post
tags: [vue, vue-autosuggest]
image: https://s3.amazonaws.com/guuu/vue-autosuggest-sloth.jpeg
---

::: slot header
# {{ this.$page.title }}
:::

![Vue-autosuggest slots](https://s3.amazonaws.com/guuu/vue-autosuggest-sloth.jpeg)
_Did someone say sloths?_


## Slots!
This feature has been one that I’ve been wanting to add since I initially 
created Vue-autosuggest. I am so excited.

## History of the API
Initially, I modeled the api after a popular react library. React-autosuggest is
good because it gives you lots of control over rendering, and I wanted that 
same level in my component. Vue-autosuggest initially was using object 
inheritance to inject a user’s custom component (e.g. `UrlSection.vue`) that 
inherited from the base component so they could use any number of modifications
to the rendering inside template tags. Inheritance (we found out the hard way)
is typically a terrible idea in Vue SFCs, because when one component extends 
another, they do not share templates. This means that sub-components are brittle 
and so it was not fair to tell users to use inheritance for full rendering.

This is why we introduced `renderSuggestion`. Now users would no longer have to
extend the base component and could now access data inside a method and even use
JSX to tell vue-autosuggest how to style the items in the autosuggest results
container.

```jsx
renderSuggestion(suggestion) {
    return <div style={{ color: "red" }}>{suggestion.name}</div>;
}
```

This was great! It gave people full control and made Vue users feel like React 
developers with that sweet JSX (because we all know we have React envy, don’t 
try and hide it).

## The Solution — Slots!
The problem was that we’re Vue developers, not React developers. We have an 
ecosystem of tooling and I wanted the component to be consistent with an 
experience that Vue devs are used to… SLOTS!

```vue
<vue-autosuggest ...>
  <template slot-scope="{suggestion}">
    <div v-if="suggestion.name === 'blog'">
      <a target="_blank" :href="suggestion.item.url">{{suggestion.item.value}}</a>
    </div>
    <div v-else>{{suggestion.item}}</div>
  </template>
</vue-autosuggest>
```

Now, instead of having to scroll down to the methods section of your component 
to see how item rendering is working, you can simply inline the html inside the
slot. Aaaa feels so nice to have scoped slots. Did I mention that this is not a 
major release? Everything is backwards compatible and you can still use 
`renderSuggestion` if you want.

Check out the codesandbox example here:
<iframe src="https://codesandbox.io/embed/2kkr6x44r" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>


If you enjoyed reading this, follow me on twitter where my DM’s are always open, 
and also give [vue-autosuggest](https://github.com/darrenjennings/vue-autosuggest) a try and let me know what you think!
