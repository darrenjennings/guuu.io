<template>
  <div class="tags">
    <div class="tag" v-for="tag in tagList">
      <Badge>{{ tag }}</Badge>
    </div>  
  </div>
</template>

<script>
  export default {
    computed: {
      tagList() {
        return this.$page.frontmatter.tags
      }
    }
  }
</script>

<style lang="stylus">
.tags {
    display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  display: flex;
}
.tags .tag {
  float: left;
}
.tag .badge {
  background-color: $tagBadgeColor !important;
}
</style>
