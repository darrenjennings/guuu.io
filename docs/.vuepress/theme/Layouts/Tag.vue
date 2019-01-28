<template>
  <div>
    <div class="content">
      <TagBadges :tags="[tagName]"/>
      <Archive :groupByYear="false" :filter="filterByTag"/>
    </div>
    <Layout/>
  </div>
</template>

<script>
import Layout from "@vuepress/theme-default/layouts/Layout";
export default {
  components: { Layout },
  methods: {
    filterByTag(page) {
      return page.frontmatter.tags.indexOf(this.tagName) > -1;
    }
  },
  computed: {
    tagName() {
      return this.$route.meta.tagName;
    }
  }
};
</script>

<style scoped>
.tags {
  padding-left: 1.2em;
}
</style>
