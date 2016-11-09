const fs = require('fs');
exports.index = function* (next){
	// 数据库操作示例
	// var result = yield Movie.find({_id: id}).exec()
	yield this.render('pages/index', {title: '主页'})
}

exports.upload = function* (next){
	// 处理文件上传
	const f = this.request.body.files[0] ;
	const tmp_path = f.path;
	const save_path = __dirname+ '../public/uploads'
	fs.createReadStream(tmp_path).pipe(fs.createWriteStream(save_path+'/file')) ;
	yield next;
	// 使用koa-body处理混和表单的时候普通字段使用this.request.body.fields而非简单的this.request.body
}