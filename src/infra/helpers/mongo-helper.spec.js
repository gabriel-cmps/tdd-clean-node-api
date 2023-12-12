const MongoHelper = require('./mongo-helper')

describe('Mongo Helper', () => {
  test('Should return true for successful connection', async () => {
    const sut = MongoHelper
    const mockDb = {
      admin: () => ({
        ping: async () => ({ ok: 1 })
      })
    }
    const result = await sut.isConnected(mockDb)
    expect(result).toBeTruthy()
  })

  test('Should return false for unsuccessful connection', async () => {
    const sut = MongoHelper
    const mockDb = {
      admin: () => ({
        ping: async () => {
          throw new Error('Connection failed')
        }
      })
    }
    const result = await sut.isConnected(mockDb)
    expect(result).toBeFalsy()
  })

  test('Should return false if db is not provided', async () => {
    const sut = MongoHelper
    const result = await sut.isConnected(null)
    expect(result).toBeFalsy()
  })

  test('Should reconnect when getDb() is invoked and client is disconnected', async () => {
    const sut = MongoHelper
    await sut.connect(process.env.MONGO_URL)
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getDb()
    expect(sut.db).toBeTruthy()
  })
})
