const services = require('../service')
const { validateToken } = require('../util')

module.exports = async function (ctx, next) {
  const token = ctx.query.token || ctx.request.body.token || ctx.get('x-transfer-token')

  if (!validateToken(token)) {
    const { file } = ctx.request.files || {}
    if (file) {
      // 校验不通过时删掉已经上传的文件
      await services.redis.client.publish('__keyevent@0__:del', file.newFilename)
    }

    ctx.throw(401, 'token is invalid')
  } else {
    await next()
  }
}
