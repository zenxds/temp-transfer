const path = require('path')
const fse = require('fs-extra')
const { isEmptyDir } = require('../util')
const services = require('../service')

const subscribe = services.redis.factory()
const uploadDest = path.join(path.dirname(__dirname), 'public')

exports.upload = async(ctx) => {
  // 缓存1小时
  await services.redis.client.set(ctx.file.filename, '1', 'EX', 3600)
  ctx.body = ctx.file.filename
}

// redis-cli config set notify-keyspace-events Egx
subscribe.subscribe('__keyevent@0__:expired', '__keyevent@0__:del', (err) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message)
  }
})

subscribe.on('message', (channel, message) => {
  const file = path.join(uploadDest, message)
  if (fse.existsSync(file)) {
    fse.removeSync(file)

    const dir = path.dirname(file)
    if (isEmptyDir(dir)) {
      fse.removeSync(dir)
    }
  }
})
