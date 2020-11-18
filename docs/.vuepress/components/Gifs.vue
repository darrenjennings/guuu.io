<<template>
  <div>
    <div class="d-flex justify-content-center w-100"><b>Click to copy</b></div><br>
    <template v-for="src in imageUrls" :url="src"  class="d-flex">
      <div :key="src" class="d-flex d-inline-flex">
        <GifImage :url="src" class="d-flex" />
      </div>
    </template>
  </div>
</template>

<script>
import { gifs } from '../data/gifs'
import GifImage from './GifImage'

export default {
  components: {
    GifImage,
  },

  computed: {
    gifs () {
      return gifs.tree
        .filter(file => file.path.indexOf('gifs/') > -1)
        .map(file => file.path.split('/')[1].split('.')[0])
    },
    
    imageUrls () {
      return this.gifs.map(g => `https://guuu.io/gifs/${g}`)
    }
  }
}
</script>
