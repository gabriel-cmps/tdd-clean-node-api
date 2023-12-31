const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(8080, () => console.log('⚡️ Server running ⚡️'))
  })
  .catch(console.error)
