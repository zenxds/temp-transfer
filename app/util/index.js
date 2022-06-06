const fs = require('fs')
const config = require('config')
const transferToken = config.get('transfer.token')

exports.isEmptyDir = dest => {
  return (
    !fs.existsSync(dest) ||
    (fs.statSync(dest).isDirectory() && !fs.readdirSync(dest).length)
  )
}

exports.validateToken = token => {
  if (!transferToken) {
    return true
  }

  return token === transferToken
}
