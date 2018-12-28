<template>
  <div>
    <div :key="year" v-for="year in Object.keys(archivePages).reverse()">
      <h3 v-if="groupByYear">{{ year }}</h3>
      <ul :key="page.title" v-for="page in sortByDate(archivePages[year])">
        <li :id="page.key" v-if="page.title && page.title !== 'guuu'">
          <router-link :to="page.path">{{page.title}}</router-link>
          <Date :page="page"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      filter: {
        type: Function,
        required: false,
        default: () => true
      },
      groupByYear: {
        type: Boolean,
        required: false,
        default: true
      }
    },
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

          if(this.filter(p)){
            acc[year].push(p)
          }
          
          return acc
        }, {})
      }
    },
    methods: {
      sortByDate(pages){
        return pages.sort((a,b) => {
          return new Date(a.frontmatter.date) < new Date(b.frontmatter.date) ? 1 : -1
        })
      },
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
