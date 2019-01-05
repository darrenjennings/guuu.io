module.exports = (options, context) => ({
  name: 'copy-sitemap',
  async generated () {
    const { logger, fs, path } = require('@vuepress/shared-utils')
    const { outDir } = context
    const sitemapFilePath = path.resolve(outDir, 'sitemap.xml')

    logger.wait('Copying sitemap.xml into dist...')

    await fs.writeFile(
      sitemapFilePath,
      await fs.readFile(path.resolve(__dirname, '../../sitemap.xml'), 'utf8'),
      { flag: 'a' }
    )
  }
})
