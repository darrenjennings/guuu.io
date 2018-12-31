<template>
  <div>
    <a target="_blank" :href="editLink">
      Edit this page on Github<OutboundLink/>
    </a>
  </div>
</template>

<script>
import { normalize, endingSlashRE } from '@vuepress/theme-default/util'
  export default {
    name: 'EditLink',
    computed: {
      editLink() {
        const editLinkPath = this.$page.frontmatter.editLinkPath
        let path = normalize(this.$page.path)
        if (endingSlashRE.test(path)) {
          path = path.slice(0, -1)
          path += ".md"
        }
        const parts = path.split("/")
        path = parts[parts.length - 1]
        return `https://github.com/darrenjennings/guuu.io/blob/master/${editLinkPath || `docs/_posts/${path}`}`
      }
    },
  }
</script>

<style scoped>

</style>
