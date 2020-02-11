<template>
  <div class="tags">
    <ClientOnly>
      <div class="tag" v-for="tag in tagList">
        <router-link :to="$tags.map[tag].path">
          <KBadge appearance="success">{{ tag }}</KBadge>
        </router-link>
      </div>
    </ClientOnly>
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
  width: auto;
  --KBadgeWidth: auto;
  --KBadgePaddingX: 1rem;
}

.tags .tag {
  margin-right: 0.5rem;
  float: left;
  margin-top: 0.5rem;
}

.k-badge{
  text-overflow: ellipsis;
  max-width: 40ch;
  overflow-x: hidden;
  white-space: nowrap;
  display: block !important;
  padding-top: 0.7rem !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
