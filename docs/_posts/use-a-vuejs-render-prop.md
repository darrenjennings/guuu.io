---
title: Use a Vue.js Render Prop!
description: Vue can use jsx to utilize the react pattern of a render prop
date: "2018-03-12T17:36:55.338Z"
layout: Post
tags: [vue, patterns, react]
---

::: slot header
# {{ this.$page.title }}
:::

![Vuejs Render Prop](./images/vue_react.jpeg)

***UPDATE**: I’m using render props in [vue-autosuggest](https://github.com/darrenjennings/vue-autosuggest) in the renderSuggestion prop, so go check it out!*

In Vue, templates are typically how we compose/extend/mix/
[open source](https://medium.com/@darrenjennings/open-sourcing-your-first-vue-component-5ef015e1f66c) 
our components. This is contra the experience of React developers who write most
of their compiled html in JSX. Thanks to a similar architecture of using the 
[virtualDOM + createElement](https://vuejs.org/v2/guide/render-function.html#The-Virtual-DOM) 
api and [babel-plugin-transform-vue-js](https://github.com/vuejs/babel-plugin-transform-vue-jsx), 
we can write our Vue components in almost the same way we write React! *Not that 
we should do this for all components, but it’s fun to see design patterns and 
utilize them. For demonstration, I will use an example from 
[“Use a Render Prop!”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) 
article by Michael Jackson.

First the SFC:
```vue
<template>
  <div id="app">
    <Mouse :render="renderPosition"/>
  </div>
</template>

<script>
import Mouse from "./Mouse.js";
export default {
  name: "app",
  components: {
    Mouse
  },
  methods: {
    renderPosition({ x, y }) {
      return (
        <h1>
          The mouse position is ({x}, {y})
        </h1>
      );
    }
  }
};
</script>
<style>
* {
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
```
Here in our parent `App.vue`, the `Mouse` component will be our child component. 
Inside `Mouse.js` we will call our `renderProp` function callback inside the 
render method. I’ve mixed JSX inside the SFC’s `methods` section as you can’t 
use jsx inside `template`. Here’s our `Mouse` component:

```js
const Mouse = {
  name: "Mouse",
  props: {
    render: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      x: 0,
      y: 0
    };
  },
  methods: {
    handleMouseMove(event) {
      this.x = event.clientX;
      this.y = event.clientY;
    }
  },
  render(h) {
    return (
      <div style={{ height: "100%" }} onMousemove={this.handleMouseMove}>
        {this.$props.render(this)}
      </div>
    );
  }
};

export default Mouse;
```

Yes this is a **Vue** component, not React. Compared with the react version:
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// Instead of using a HOC, we can share code using a
// regular component with a render prop!
class Mouse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  }

  state = { x: 0, y: 0 }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

const App = React.createClass({
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Mouse render={({ x, y }) => (
          // The render prop gives us the state we need
          // to render whatever we want here.
          <h1>The mouse position is ({x}, {y})</h1>
        )}/>
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
```

Some differences between the two:
- Vue has built in prop type validation.
- You can’t inline an anonymous function that returns jsx inside a template. 
I’ve named the callback `renderPosition`. You can reasonably use a simple vue js
component as the parent to pass in an anonymous function, but alas, we’re Vue 
developers so we can mix our templates with our JSX and be happy about it!
- We’re passing back `this` (the Vue instance) instead of the React state, but 
utilize [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 
all the same to pass back `x` and `y`.
- The obvious Vue differences such as components are just objects, not 
javascript classes, there is no “setState” as it converts it’s reactive data 
properties (the corollary to React’s state) to getter/setters using 
Object.defineProperty.
- `onMouseMove` vs `onMousemove` 💣

Codesandbox demonstrating Vue Render Prop pattern:
<iframe src="https://codesandbox.io/embed/q9zm2j1jr9" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

So there you go, a fairly similar and transferable component design.


## Scoped Slots
> [In case you are wondering what’s the equivalent pattern in Vue, it’s called 
scoped slots (and if using JSX it works the same as React)&mdash; Evan You (@youyuxi) 
September 25, 2017](https://twitter.com/youyuxi/status/912422434300710912?ref_src=twsrc%5Etfw)

If you were to do “render props” with templates, a similar design would be to 
use scoped slots and would look something like this:
<iframe src="https://codesandbox.io/embed/5vxn0nzj0l" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
Vue Scoped slots are powerful when using templates

Some advantages to scoped slots are that
- custom parent-child template injection without a render function or jsx.
- you can specify default content easily. In the above example, I pass in a 
specified slot, that defines a custom message, but when I don’t specify a slot, 
it will fallback to the default slot. A default slot also gives users of the 
component a “component api” so that you don’t have to guess what you might need 
to render.
- uses destructuring similar to jsx render callback
- parent content to be rendered with child data is “inline” with the template
- you [will probably never be able to inline a jsx function in your template](https://github.com/vuejs/vue/issues/7439)

## Closing Remarks
Why would I want to use the render prop pattern or JSX? The nice thing about 
this is that using the render function + JSX is a closer-to-the-compiler 
alternative and allows fine-grain control over rendering. You won’t be able to
use custom directives like v-model or v-if. Render props themselves have a lot 
of benefits, as outlined in 
[this episode of Full stack radio](http://www.fullstackradio.com/79) where Adam 
interviews Kent C. Dodds. If you’re a Vue user, does this type of component 
composing surprise you? If so, I recommend going and reading the 
[official docs](https://vuejs.org/v2/guide/render-function.html#Basics) which 
actually explain JSX and render functions in greater detail.

I love that we can share design principles between frameworks. It gives me warm 
fuzzy feelings in a cruel, cold world that believes there is a war on 
frameworks. In 2018, try and find the common ground.

Further reading:
- [Source code](https://github.com/darrenjennings/vue-jsx-render-props-example)
- [official Vue documentation](https://vuejs.org/v2/guide/render-function.html#Basics)
- [original article on using render props and what this article’s title is referencing.](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)
- [a helpful article on similarities in frameworks converging react + vue + angular](http://varun.ca/convergence/)
