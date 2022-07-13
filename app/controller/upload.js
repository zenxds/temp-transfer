const path = require('path')
const config = require('config')
const services = require('../service')
const { deleteUploadFile } = require('../util')

// const appLogger = require('../util/logger')('app')
const uploadDest = path.join(__dirname, '../public')
const expiredQueue = new services.DelayQueue({
  queue: 'expired-queue',
  redis: services.redis.factory(),
  handler: async message => {
    const file = path.join(uploadDest, message.data.filename)
    deleteUploadFile(file)
  }
})
const cacheTime = config.get('transfer.cache') || 3600

exports.upload = async(ctx) => {
  // file.filepath 完整路径
  const { file } = ctx.request.files
  const filename = file.newFilename

  await expiredQueue.add({ filename }, cacheTime)
  ctx.body = filename
}
