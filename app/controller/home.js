exports.index = async ctx => {
  await ctx.render('index', {
    token: ctx.query.token
  })
}
