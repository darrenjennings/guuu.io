const readingTime = require('reading-time')

module.exports = (options = {}, context) => ({
  extendPageData ($page) {
    if($page.title){
      var stats = readingTime($page._strippedContent);
      $page.readingTime = stats
    }
  }
})
