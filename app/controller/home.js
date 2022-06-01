const services = require('../service')

exports.index = async ctx => {
  await ctx.render('index', {
    token: ctx.query.token
  })
}
