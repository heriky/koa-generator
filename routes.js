const router = require('koa-router')() ;
const koaBody = require('koa-body');
const indexC = require('./controllers')

router
.get('/', indexC.index)
.post('/upload', koaBody({multipart: true}), indexC.upload)

module.exports = router;