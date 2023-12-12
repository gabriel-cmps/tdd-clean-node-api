const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    await this.userModel.updateOne(
      {
        _id: userId
      },
      {
        $set: {
          accessToken
        }
      }
    )
  }
}

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return { userModel, sut }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const { userModel, sut } = makeSut()
    const fakeUser = {
      _id: '6574d24210e170f988f77b74',
      email: 'valid_email@example.com',
      name: 'John',
      age: 27,
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)
    await sut.update(fakeUser._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser._id })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const fakeUser = {
      _id: '6574d24210e170f988f77b74',
      email: 'valid_email@example.com',
      name: 'John',
      age: 27,
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)
    const promise = sut.update(fakeUser._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provided', async () => {
    const { userModel, sut } = makeSut()
    const fakeUser = {
      _id: '6574d24210e170f988f77b74',
      email: 'valid_email@example.com',
      name: 'John',
      age: 27,
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUser._id)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
