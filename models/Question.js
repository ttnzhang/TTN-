const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('./base_model');
const QuestionSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    content: {
        type: String,
        require: true
    },
    imgs: [],
    create_time: {
        type: Date,
        default: Date.now
    },
    //回复量
    click_num: {
        type: Number,
        default: 0
    },
    //点赞量
    like_num: {
        type: [String],
    },
    //关注量
    follow_num:{
        type:[String],
    },
    forWard_author:{
        type:String,
        ref: 'User'
    },
    forWard_content:{
        type:String
    },
    //作者
    author: {
        type: String,
        ref: 'User'
    },
    //临时属性
    following:{
        type:Boolean
    }
})
QuestionSchema.plugin(BaseModel);
const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question