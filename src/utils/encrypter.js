const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}

module.exports = Encrypter
