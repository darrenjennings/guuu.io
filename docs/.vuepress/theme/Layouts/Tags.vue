<template>
  <div id="tags">
    <ClientOnly>
      <div class="content">
        <TagBadges :tags="$tags.list.map(t => t.name).sort()"/>
      </div>
    </ClientOnly>
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
