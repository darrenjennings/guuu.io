<template>
  <div class="counter-2">
    <button @click="crement(-1)">
      <slot name="decrement">
        -
      </slot>
    </button>
    <span>{{ count }}</span>
    <button @click="crement(1)">
      <slot name="increment">
        +
      </slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Counter1',
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    crement(amount) {
      if (this.count + amount > this.max || (this.count + amount) < this.min) {
        return
      }
      this.count = this.count + amount
    }
  }
};
</script>

<style scoped>
button {
  border: 0.5px solid #efefef;
  background-color: white;
}
</style>