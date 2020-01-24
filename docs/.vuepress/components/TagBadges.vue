<template>
  <div class="tags">
    <div class="tag" v-for="tag in tagList">
      <router-link v-if="$tags" :to="$tags.map[tag].path">
        <KBadge appearance="success">{{ tag }}</KBadge>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tags: {
        type: Array,
        required: false,
        /** Defaults to current page's tags */
        default: function(){
          return null
        }
      },
    },
    computed: {
      tagList() {
        return this.tags || this.$page.frontmatter.tags
      }
    }
  }
</script>

<style>
.tags {
  align-items: center;
  justify-content: left;
  width: 100%;
  display: flex;
  --KBadgeWidth: auto;
  --KBadgePaddingX: 1rem;
}

.tags .tag {
  margin-right: 0.25rem;
}
</style>
