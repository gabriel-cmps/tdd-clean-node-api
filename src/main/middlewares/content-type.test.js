const request = require('supertest')

describe('Content-type Middleware', () => {
  let app
  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })
  test('Should return content-type as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type').expect('Content-Type', /json/)
  })

  test('Should return xml content-type if forced', async () => {
    app.get('/test_content_type', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /xml/)
  })
})
