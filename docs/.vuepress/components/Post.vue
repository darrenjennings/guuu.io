<template>
  <div class="theme-container post">
    <Content slot-key="header"/>
    <div class="wrapper">
      <span style="color: hsl(0, 0%, 60%)"><Date/> · <ReadingTime /></span>
    </div>
    <Layout/>
    <div class="wrapper">
      Tags: <Tags style="margin: 0.5rem 0 2rem 0;"/>
    </div>
    <Bio/>
  </div>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout'

export default {
  components: { Layout }
}
</script>


<style>

.post .content {
  padding: 0 2rem 0;
}

.post .content:not(.custom) > h1:first-child {
  margin-bottom: 0 !important;
}

.post .content.header{
  margin-top: 2rem;
}

.post .date-container {
  display:inline-block;
}

.post .content:not(.custom) {
  padding: 0;
}
</style>
