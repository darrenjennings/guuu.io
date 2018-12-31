<template>
  <div class="counter-1">
    <button @click="crement(-1)">-</button>
      <span>{{ count }}</span>
    <button @click="crement(1)">+</button>
  </div>
</template>

<script>
export default {
  name: 'Counter1',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    crement(amount) {
      this.count = this.count + amount
    }
  }
};
</script>