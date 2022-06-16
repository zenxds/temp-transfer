const path = require('path')
const config = require('config')
const fse = require('fs-extra')
const { isEmptyDir } = require('../util')
const services = require('../service')

const appLogger = require('../util/logger')('app')
const db = config.get('redis.db') || 0
const subscribe = services.redis.factory()
const uploadDest = path.join(__dirname, '../public')
const cacheTime = config.get('transfer.cache') || 3600

exports.upload = async(ctx) => {
  // file.filepath 完整路径
  const { file } = ctx.request.files
  const filename = file.newFilename

  // 缓存1小时
  await services.redis.client.set(filename, '1', 'EX', cacheTime)
  ctx.body = filename
}

// redis-cli config set notify-keyspace-events Egx
subscribe.subscribe(`__keyevent@${db}__:expired`, `__keyevent@${db}__:del`, (err) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message)
  }
})

subscribe.on('message', (channel, message) => {
  appLogger.info('[redis] %s %s', channel, message)
  const file = path.join(uploadDest, message)
  if (fse.existsSync(file)) {
    fse.removeSync(file)

    const dir = path.dirname(file)
    if (isEmptyDir(dir)) {
      fse.removeSync(dir)
    }
  }
})
