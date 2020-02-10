<template>
  <div>
    <div class="content">
      <div class="d-flex pl-4">
        <TagBadges :tags="[tagName]"/>
      </div>
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
