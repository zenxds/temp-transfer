const Router = require('@koa/router')
const router = new Router()

const tokenVerify = require('../middleware/token')
const controller = require('../controller/upload')

router.post('/', tokenVerify, controller.upload)

module.exports = router
