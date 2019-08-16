---
title: How to Migrate to Vue 2.6
description: Migrating to Vue 2.6
date: '2019-08-15T17:36:55.338Z'
layout: Post
tags: [vue]
---

::: slot header

# {{ this.$page.title }}

:::

I recently migrated our static vue app at work from 2.5 -> 2.6. Here are some
notes that might help you:

## Update your dependencies to 2.6

```sh
yarn add vue-template-compiler@^2.6.10 vue@^2.6.10
```

## Using Vuepress with Vue 2.6

When Vuepress and Vue are in the same `package.json`, there are some package
version conflicts to note. If you have Vuepress ^1.0.2, you will see this kind
of error:

```
Error:

Vue packages version mismatch:

- vue@2.6.10
- vue-server-renderer@2.5.22
```

To resolve this, we can use a feature of `yarn`.

### Yarn Resolutions

Yarn comes with a feature called
[Yarn Resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/).
This allows you to state explicit versions inside your `package.json` when a
package needs to resolve to a specific version.

Remove `vue`, `vue-template-compiler`, and if you happen to have them in your
dependencies or devDependencies(probably unlikely), remove `vue-server-renderer`
and `@vuepress/core`. Then add a `resolutions` field to your package.json:

```json
"resolutions": {
  "vue": "^2.6.10",
  "vue-template-compiler": "^2.6.10",
  "vue-server-renderer": "^2.6.10",
  "@vuepress/core": "1.0.2"
},
```

## Update Your Slot Template Syntax

While the slot syntax got much simpler, it's fully backwards compatible. This is
not a necessary change, but I recommend trying it out on your components using
slots.

Here is a renderless component that passes in some toggling functionality:

```vue
<!-- ❌ Old way -->
<KToggle>
  <template slot-scope="{ isToggled, toggle }">
    <KButton @click="toggle">
      {{ isToggled ? 'toggled' : 'not toggled' }}
    </KButton>
  </template>
</KToggle>

<!-- ✅ >= 2.6 -->
<KToggle v-slot="{ isToggled, toggle }">
  <KButton @click="toggle">
    {{ isToggled ? 'toggled' : 'not toggled' }}
  </KButton>
</KToggle>
```

Here's an example with named slots:

```vue
<!-- ❌ Old way -->
<Header>
  <template slot="title">
    <h1>User 2</h1>
  </template>
  <template slot="actions" slot-scope="{canEdit}">
    <a v-if="canEdit" href="/users/2/edit">Edit</a>
  </template>
</Header>

<!-- ✅ >= 2.6 -->
<Header>
  <template #title> <!-- or v-slot:title-->
    <h1>User 2</h1>
  </template>
  <template #actions="{canEdit}"> <!-- or v-slot:actions="{canEdit}"-->
    <a v-if="canEdit" href="/users/2/edit">Edit</a>
  </template>
</Header>
```

## Check Components using Render Functions

Return values of slots are now _always guaranteed to be a array or undefined_.
This
[bit me recently](https://github.com/darrenjennings/vue-autosuggest/pull/112) so
one thing I'm doing now is testing multiple versions of Vue to catch bugs like
this.

```js
const Child = {
  render(h) {
    // in >2.6 this will always return an Array or undefined. Before, you could
    // get a single VNode or an Array of multiple VNodes and you would need to do
    // extra validations on the slots.
    return this.$scopedSlots.default({})
  }
}
```

There are some other changes in 2.6, but in this article I wanted to focus on
what I found helpful to know, and write the article that I would have wanted to
read when I was migrating to 2.6.

Links:

- Evan You article on 2.6 release
  [link](https://medium.com/the-vue-point/vue-2-6-released-66aa6c8e785e)
- docs on slots [link](https://vuejs.org/v2/guide/components-slots.html#ad)
- [gist](https://gist.github.com/yyx990803/f5cba7711ab57b5d0dd1f8261ebee278)
  explaining scoped slots return value

Thanks to the core team for helping me out:

- [sodatea](https://github.com/sodatea) for the prior art in the
  [vue-cli](https://github.com/vuejs/vue-cli/blob/cc66247950cf81552f4e50a934d60fa361bf7351/package.json#L77-L83)
  repo.
- Edd Yerburgh for
  [prior art](https://github.com/vuejs/vue-test-utils/blob/dev/scripts/test-compat-all.sh)
  with testing multiple versions of vue.
