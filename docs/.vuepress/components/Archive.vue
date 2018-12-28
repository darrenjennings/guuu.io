<template>
  <div>
    <div :key="year" v-for="year in Object.keys(archivePages).reverse()">
      <h3>{{ year }}</h3>
      <ul :key="page.title" v-for="page in archivePages[year]">
        <li :id="page.key" v-if="page.title && page.title !== 'guuu'">
          <router-link :to="page.regularPath">{{page.title}}</router-link>
          <Date :page="page" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      archivePages () {
        return this.$site.pages.reduce((acc, p) => {
          const year = this.getPostYear(p)
          
          if(!year){
            return acc
          }
          
          if (!acc[year]){
            acc[year] = []
          }

          acc[year].push(p)
          
          return acc
        }, {})
      }
    },
    methods: {
      getPostYear(post) {
        return new Date(post.frontmatter.date).getFullYear()
      }
    }
  }
</script>

<style scoped>
.excerpt {
  color: gray;
}

ul {
  list-style-type: none;
}
</style>
