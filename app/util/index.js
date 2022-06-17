const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const config = require('config')
const transferToken = config.get('transfer.token')

const isEmptyDir = dest => {
  return (
    !fs.existsSync(dest) ||
    (fs.statSync(dest).isDirectory() && !fs.readdirSync(dest).length)
  )
}

exports.deleteUploadFile = file => {
  if (fse.existsSync(file)) {
    fse.removeSync(file)

    const dir = path.dirname(file)
    if (isEmptyDir(dir)) {
      fse.removeSync(dir)
    }
  }
}

exports.validateToken = token => {
  if (!transferToken) {
    return true
  }

  if (Array.isArray(transferToken)) {
    return transferToken.includes(token)
  }

  return token === transferToken
}
