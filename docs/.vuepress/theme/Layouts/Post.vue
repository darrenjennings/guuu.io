<template>
  <div class="post">
    <Content slot-key="header"/>
    <div class="meta wrapper">
      <Date/> · <ReadingTime />
    </div>
    <ParentLayout />
    <div class="wrapper">
      <PostFooter />
    </div>
    <Bio/>
  </div>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  components: { ParentLayout }
}
</script>


<style>
.post .content {
  padding: 0 1.5rem 0 !important;
  max-width: var(--content-width);
}

.post .content:not(.custom) > h1:first-child {
  margin-bottom: 0 !important;
}

.post .content:not(.custom) > *:first-child {
    margin-top: 2rem;
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
