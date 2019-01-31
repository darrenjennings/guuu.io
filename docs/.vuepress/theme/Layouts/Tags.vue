<template>
  <div id="tags">
    <div class="content">
      <TagBadges :tags="$tags.list.map(t => t.name).sort()"/>
    </div>
    <Layout/>
  </div>
</template>

<script>
import Layout from "@vuepress/theme-default/layouts/Layout";
export default {
  components: { Layout }
};
</script>

<style scoped>
.tags {
  padding-left: 1.2em;
}
</style>
