const { validateToken, deleteUploadFile } = require('../util')

module.exports = async function (ctx, next) {
  const token = ctx.query.token || ctx.request.body.token || ctx.get('x-transfer-token')

  if (!validateToken(token)) {
    const { file } = ctx.request.files || {}
    if (file) {
      // 校验不通过时删掉已经上传的文件
      deleteUploadFile(file.filepath)
    }

    ctx.throw(401, 'token is invalid')
  } else {
    await next()
  }
}
