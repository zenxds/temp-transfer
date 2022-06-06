const Router = require('@koa/router')
const router = new Router()

const controller = require('../controller/upload')

router.post('/', controller.upload)

module.exports = router
