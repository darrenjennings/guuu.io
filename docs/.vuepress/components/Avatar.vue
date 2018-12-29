<template>
  <div class="top">
    <router-link to="/about/" class="avatar">
      <img alt="Darren Jennings face" src="/avatar.png"/>
    </router-link>
    <h1 v-if="headerText">{{ headerText }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      required: false,
      default: null
    },
  },
}
</script>
<style scoped>
.top {
  display: flex;
}

img {
  height: 75px;
  width: auto;
}

.avatar + h1 {
  margin-left: 1rem;
}

</style>
