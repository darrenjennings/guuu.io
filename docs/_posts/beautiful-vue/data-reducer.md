---
title: "Beautiful Vue Part 1: The Data Reducer"
description: Vue Patterns - The Data Reducer
permalink: beautiful-vue/data-reducer
date: 2018-12-30 16:16
tags: [vue, patterns, beautiful-vue]
layout: Post
---

::: slot header
# {{ this.$page.title }}
:::

> This is the first in a series of blog posts describing Vue patterns that I
> have found helpful, and I hope it helps you too.

Imagine that you are writing a Vue application for a shopping cart, where the
user is able to control how many items they want in their cart.

```vue
Items in cart: <Counter />
```

<CodePreview>
  <div>
    Items in cart: <Counter1 />
  </div>
</CodePreview>

The first thing you will notice is that this component is too basic. It needs
some enhanced functionality. Users shouldn't be able to add negative items to
their cart. Since this is the "counter" component it would make sense to make it
reusable, so instead of making every counter enforce a positive total, we can
add a `min` property.

```html
<Counter :min="0" />
```

The component feels good. It's simple enough and solves your immediate use case.
You deploy the counter component and the checkout system works as expected.

A few months go by, and your company is growing. There is a new use case coming
from another team eager to reuse your component in a new voting feature that
allows users to upvote or downvote. They would like a new property `max` and the
ability to change the button text, as the buttons will now be emojis
:thumbsdown: :thumbsup:. They also would like a callback function, that triggers
every time the counter is changed so they can make an XHR request to the voting
API. They want the component's api to be flexible because while they are using
emojis now, they're really keen to eventually use in-house icons, so the content
should be slotted to "future-proof" it.

```vue
<Counter :max="10" :min="-10" @click="onVoteClick">
  <span slot="decrement">👎</span>
  <span slot="increment">👍</span>
</Counter>
```

<CodePreview>
  <div>
    <Counter2 :max="10" :min="-10">
      <span slot="decrement">👎</span>
      <span slot="increment">👍</span>
    </Counter2>
  </div>
</CodePreview>

Not too bad. The original API didn't have to change and we were able to
implement some new non-breaking changes that give the component new
functionality.

A few more months go by and you are no longer the maintainer of the
`<Counter />` component. It has been reused throughout various apps across your
organization and it was eventually
[open sourced](/2017/open-sourcing-my-first-component). New requirements came in
that caused the maintainers to add even more props, which led to more complexity
and documentation. It became hard to predict how changing the component might
affect your organization or the community at large. This was alleviated by a
test suite and the engineers maintaining the app were thoughtful to make sure
the features didn't go out of scope, but you felt that looking back there could
be a better way. **What if we could make our component flexible without having
to predict the future?**

## The Data Reducer

You can think of your component as a chef at your favorite restaurant. The chef
prepares the meal as you ordered it from the menu (no onion, extra pickles,
gluten-free i.e. the component's input props). However, when you finally get the
meal delivered to your table, you decide that it needs to be cut into fourths
because you want to share with your kids, and also the chef gave you a lettuce
wrap because that's the only gluten-free option, but your six-year old hates
lettuce so you remove the lettuce from only their portion. The Data Reducer is
all the decisions you made before you finally ate the food. The best part is
that the chef was able to do what they do best, while the patrons were still
able to customize their meal once it was handed to them.

Going back to the first example of our shopping cart, we can see that instead of
implementing `min`, we could instead ask the user of the component what the
state should be during the counter's state transition. The user could tell us
"hey, if the button is trying to go beyond my max, then don't change it". This
gives the power to the user (i.e. inverting control) over how state is mutated
and gives users a hook into the functionality without having to anticipate all
possible state transitions.

```vue
<!-- Counter.vue -->
<template>
  <div>
    <button @click="crement(-1)">-</button> {{ count }}
    <button @click="crement(1)">+</button>
  </div>
</template>

<script>
// Helper function to apply changes to the data
function setData(vm, changes) {
  for (let item in changes) {
    vm[item] = changes[item]
  }
}

export default {
  name: "counter",
  props: {
    reducer: {
      type: Function,
      required: false,
      // Use all the changes by default
      default: (vm, changes) => {
        return {
          ...changes
        }
      }
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    crement(amount) {
      // Grab the subset of changes from the user
      // via the reducer prop (i.e. the Data reducer)
      //                      ┌─────this guy
      const changes = this.reducer(this.$data, {
        count: this.count + amount
      })
      // Apply the changes
      setData(this, changes)
    }
  }
}
</script>
```

Here are some features we can build now that we have a reducer.

Max / Min

```js
counterReduce(state, changes) {
  const max = 3
  const min = 0
  let newCount = changes.count

  if (changes.count > max) newCount = max
  if (changes.count < min) newCount = min

  return {
    ...changes,
    count: newCount
  }
}
```

Adjust Increment Value, Step by 10

```js
counterReduce(state, changes) {
  const delta = changes.count - state.count

  return {
    ...changes,
    count: state.count + delta * 10
  }
}
```

Fibonacci Stepper! (Just for fun, not very useful)

```js
counterReduce(state, changes) {
  if (state.count >= 1) {
    // have to keep track of prevVal in App.vue data
    this.prevVal = state.count - this.prevVal
  }

  const res = {
    ...changes,
    count: state.count + this.prevVal
  }
  return res
}
```

## Handling Multiple Reducers

This example is simple, but when components have many moving parts it is
advantageous to define types of changesets. For example, it is common for some
counter steppers, in the case where you would like to go from 0 to 100, to not
have to click the `+` button 100 times. We could make the count an `<input/>`
and give the user the ability to edit it directly. With a button, you might
throttle the clicking (if it's hitting an API), but input changes don't need to
be throttled. The `<Counter/>` component would still utilize the same reducer
prop, but would send back a type depending on what was mutating the state. You
might want to handle an input change state change differently or even change the
type based on what kind of `crement` it was. The way you can handle this would
be to define a type, very much akin to Vuex actions

```js
// Similar to vuex actions, define a type
store.dispatch("increment", {
  amount: 10 //    └─────── action type
})
```

```js
// Counter.vue
crement(amount) {
  const changes = this.reducer(this.$data, {
    type: amount > 0 ? "increment" : "decrement",
    count: this.count + amount
  })

  delete changes.type
  setData(this, changes)
}

// App.vue
counterReduce(state, changes) {
  console.log(changes.type) // "increment" or "decrement"
  return {
    ...changes,
    count: state.count + delta * 10
  };
},
```

### Benefits / Drawbacks

The benefits of the Data Reducer are extensibility, as a way to make your
component as useful as possible when it's lower level or needs to satisfy the
needs of many consumers. I would not recommend this pattern for components that
are not reused often. It's important to note that many client specific
components are better than one general purpose interface component. I tend to
overengineer things, and I could see this pattern being annoying for end users
who just want "batteries included". `:max="3"` is a lot easier to write than
defining a new function and implementing the logic yourself. The Data Reducer
pattern really shines when a component has behavior that is not well defined,
and there are many clients who might need to tweak it slightly.

Useful links:

- Thank you to
  [Kent C. Dodds for turning me onto this pattern](https://blog.kentcdodds.com/the-state-reducer-pattern-%EF%B8%8F-b40316cfac57)
