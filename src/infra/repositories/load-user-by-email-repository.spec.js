const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
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

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@example.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = {
      _id: '6574d24210e170f988f77b74',
      email: 'valid_email@example.com',
      name: 'John',
      age: 27,
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)
    const user = await sut.load('valid_email@example.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('Should throw if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_email@example.com')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
