<<template>
  <div class="gif d-flex align-items-center justify-content-center" @click="copyToClipboard(url)">
    <img :src="url" />
    <div class="d-flex gif-text" style="position: absolute;">{{url.split('/gifs/')[1]}}</div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },
  
  methods: {
    copyToClipboard (url) {
      if (this.copyTextToClipboard(url)) {
        alert('copied to clipboard: ' + url)
      }
    },
    
    copyTextToClipboard (text) {
      let isSuccess = true

      // Solution from:
      // https://stackoverflow.com/a/30810322
      const textArea = document.createElement('textarea')

      // Styles for ensuring browser support
      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = 0
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'

      textArea.value = text

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (e) {
        isSuccess = false
      } finally {
        document.body.removeChild(textArea)
      }

      return isSuccess
    }
  }
}
</script>

<style scoped>
* {
  transition: 200ms linear;
}
.gif img {
  width: 150px;
}
.gif:hover {
  cursor: pointer;
}
.gif:hover img {
  filter: invert();
  opacity: 0.2;
}

.gif-text {
  opacity: 0;
}
.gif:hover .gif-text {
  opacity: 1.0;
  color: black;
  z-index: 1;
}
</style>
