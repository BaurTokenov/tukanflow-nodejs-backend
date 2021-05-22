import { getMetadata } from 'page-metadata-parser'
import domino from 'domino'
import fetch from 'node-fetch'

module.exports = app => {
  app.get('/api/fetchUrl', async (req, res) => {
    const { url } = req.query
    const response = await fetch(url)
    const html = await response.text()
    const doc = domino.createWindow(html).document
    const metadata = getMetadata(doc, url)
    res.status(200).send({
      success: 1,
      meta: {
        title: metadata.title,
        description: metadata.description,
        image: {
          url: metadata.image
        }
      }
    })
  })
}
