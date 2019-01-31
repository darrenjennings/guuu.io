<template>
  <ParentLayout/>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  components: {
    ParentLayout
  }
}
</script>

<style scoped>
.post .content {
  padding: 0 1.5rem 0;
  max-width: var(--content-width);
}

.page .content:not(.custom) {
  margin: 2rem auto;
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
