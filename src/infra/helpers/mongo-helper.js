const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri, dbName) {
    this.uri = uri
    this.dbName = dbName
    this.client = await MongoClient.connect(uri)
    this.db = this.client.db(dbName)
  },
  async isConnected (db) {
    if (!db) {
      return false
    }

    let res

    try {
      res = await db.admin().ping()
    } catch (err) {
      return false
    }

    return Object.prototype.hasOwnProperty.call(res, 'ok') && res.ok === 1
  },
  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },

  async getDb () {
    if (!this.client || !await this.isConnected(this.db)) {
      await this.connect(this.uri, this.dbName)
    }

    return this.db
  }
}
