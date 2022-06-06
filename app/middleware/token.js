const services = require('../service')
const { validateToken } = require('../util')

module.exports = async function (ctx, next) {
  const token = ctx.query.token || ctx.request.body.token || ctx.get('x-transfer-token')

  if (!validateToken(token)) {
    const { file } = ctx.request.files || {}
    if (file) {
      await services.redis.client.publish('__keyevent@0__:del', file.newFilename)
    }

    ctx.throw(401, 'token is invalid')
  } else {
    await next()
  }
}
