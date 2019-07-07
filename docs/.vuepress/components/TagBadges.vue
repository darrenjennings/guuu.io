<template>
  <div class="tags">
    <div class="tag" v-for="tag in tagList">
      <router-link :to="$tags.map[tag].path">
      <Badge>{{ tag }}</Badge>
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
}

.tags .tag {
  float: left;
  margin-right: 0.25rem;
}

.tag .badge {
  background-color: var(--tag-badge-color) !important;
  white-space: nowrap;
}
</style>
