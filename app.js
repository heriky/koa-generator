const http = require('http');
const koa = require('koa');
const app = koa() ;
const envConf = require('./env.config') ;

// 日志记录器
const logger = require('koa-logger');
app.use(logger());

// 数据库配置
const mongoose = require('mongoose');
const dbUrl = envConf.mongo.connectUri+envConf.mongo.db ;
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl)

// session 配置，koa中使用this.state存储本地变量
const session = require('koa-session');
app.keys = ['This is secret string for singed cookie'];
const sessConf = {
	key: 'koa:sess', // session存储再cookie中的key
	maxAge: 3600* 1000, // 基本单位ms
	overwrite: true,
	httpOnly: true,
	singed: true
};
app.use(session(sessConf, app));

// cookie配置 (koa自带cookie处理, ctx.cookie)

// body-parser 处理
// koa-bodyparser 只处理简单的text，json和form
// 不能处理multipart，因此要在上传的请求中，在
// koa-router中添加中间件koa-body, 配合koa-router使用
const bodyParser = require('koa-bodyparser');
app.use(bodyParser()) ;

// 静态资源配置
const serve = require('koa-static');
const favicon = require('koa-favicon');
app.use(serve(envConf.staticRes));
app.use(favicon(envConf+'/favicon.ico'))

// 模板引擎配置
const views = require('koa-views') ;// koa-views必须是v4.1以下的
app.use(views(__dirname+'/views', {extension: 'jade'}))

// 路由基本配置
const router = require('./routes') ;
app.use(router.routes()).use(router.allowedMethods()) ; // router.routes()返回所有路由,小型应用


// 错误处理
// app.on('error', (err, ctx)=.{
// 	log.error('server error', err, ctx);
// })
// app.use(function *(next){
//   console.log('>> one');
//   yield next;
//   console.log('<< one');
// });

// app.use(function *(next){
//   console.log('>> two');
//   this.body = 'two';
//   console.log('<< two');
// });

// app.use(function *(next){
//   console.log('>> three');
//   yield next;
//   console.log('<< three');
// });
http.createServer(app.callback()).listen(envConf.port||process.env.PORT||3000,(err)=>{
	console.log('server is running on port 3000')
})
