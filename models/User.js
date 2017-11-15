//用户信息表
const mongoose = require('mongoose');
//引入shortid生成ID的插件
const shortid = require('shortid');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    //定义字段
    _id:{
        type:String,
        default:shortid.generate,
    },
    //用户名
    name:{
        type:String,
        required:true
    },
    xm:{
        type:String,
        required:true
    },
    //密码
    password:{
        type:String,
        required:true
    },
    //邮箱
    email:{
        type:String,
        required:true
    },
    //个人简介
    motto:{
        type:String,
        default:'无'
    },
    //公司信息
    job:{
        type:String,
        default:'未填写'
    },
    //个人头像
    avatar:{
        type:String,
        default:'/images/default-avatar.jpg'
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //用户发表的文章数量
    article_count:{
        type:Number,
        default:0
    },
    //用户回复的数量
    reply_count:{
        type:Number,
        default:0
    },
    liked:{
        type:[String]
    },
    followWeibo:{
        type:[String]
    }
})
UserSchema.statics = {
    getUserByxms:(xms,callback)=>{
        if(xms.length == 0){
            return callback(null,[]);
        }
        User.find({xm:{$in:xms}},callback);
    },
    getUserById:(id,callback)=>{
        User.findOne({_id: id}, callback);
    }
}
const User = mongoose.model('User',UserSchema);
module.exports = User