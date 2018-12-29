<template>
  <div class="post">
    <Content slot-key="header"/>
    <div class="meta wrapper">
      <Date/> · <ReadingTime />
    </div>
    <Layout/>
    <div class="wrapper">
      <PostFooter />
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
  padding: 0 1.5rem 0;
  max-width: var(--content-width);
}

.post .content:not(.custom) > h1:first-child {
  margin-bottom: 0 !important;
}

.post .content.header{
  margin-top: 2rem;
}

.post .date-container {
  display:inline-block;
  margin-top: 0.25rem;
}

.post .meta {
  font-weight: 400;
  font-size: 14px;
  color: hsl(0,0%, 60%);
}

</style>
