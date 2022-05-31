const config = require('config')
const transferToken = config.get('transfer.token')

module.exports = async function (ctx, next) {
  if (!transferToken) {
    await next()
  } else {
    const token = ctx.query.token || ctx.request.body.token || ctx.get('x-transfer-token')
    if (!token) {
      ctx.throw(401, 'token is required')
    } else if (token !== transferToken) {
      ctx.throw(401, 'token is invalid')
    } else {
      await next()
    }
  }
}
