var multer = require('multer')
var fs = require('fs');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        fs.mkdir("./public/uploads/"+req.session.user._id,function(err){
            if (err) {
                return err;
            }
        });
        cb(null,'./public/uploads/'+req.session.user._id)
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, req.session.user._id + file.fieldname + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});
module.exports = upload;