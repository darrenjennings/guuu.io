<template>
  <div class="theme-container">
    <div class="content" v-for="data, name in $tags.list">
      {{ data.name }}
    </div>
    <Layout />
  </div>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout'
export default {
  components: { Layout }
}
</script>

<style>
.theme-container {
  margin-top: 2rem;
}
</style>
