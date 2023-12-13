const request = require('supertest')
const app = require('../config/app')

describe('Content-type Middleware', () => {
  test('Should return content-type as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type').expect('Content-Type', /json/)
  })

  test('Should return xml content-type if forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get('/test_content_type_xml').expect('Content-Type', /xml/)
  })
})
