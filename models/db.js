//连接MongoDB数据库
var mongoose = require('mongoose')
var setting = require('../setting');
//引入加密模块
const crypto = require('crypto');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${setting.host}/${setting.db}`,{
    useMongoClient: true,
});

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
        console.log("MongoDB connected disconnected.")
});
//加密
const DBSet = {
encrypt:(data,key)=>{
    //创建了一个加密的对象,第一个参数是指明算法，第二个是指明使用的密码
    let ciplher = crypto.createCipher('bf',key);
    let newPSD = '';
    newPSD += ciplher.update(data,'utf8','hex');
    newPSD += ciplher.final('hex');
    return newPSD;
    }
}
module.exports = DBSet