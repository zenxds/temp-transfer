const path = require('path')
const fse = require('fs-extra')
const uuid = require('uuid').v4
const Router = require('@koa/router')
const router = new Router()

const tokenVerify = require('../middleware/token')
const controller = require('../controller/upload')

const multer = require('@koa/multer')
const uploadDest = path.join(path.dirname(__dirname), 'public')

// 使用multer上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDest)
  },
  filename: (req, file, cb) => {
    const dir = uuid().split('-')[0]

    fse.ensureDirSync(path.join(uploadDest, dir))
    cb(null, path.join(dir, file.originalname))
  },
})
const upload = multer({
  storage: storage
})

router.post('/', tokenVerify, upload.single('file'), controller.upload)

module.exports = router
