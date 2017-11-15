/**
 * Create by Aoao at 2017/11/13
 */
const mapping = require('../static');
// 引入问题表
const Question = require('../models/Question');
const Message = require('../models/Message');
const User = require('../models/User');
exports.find = (req,res,next)=>{
    let key = req.params.key;
    var regExp = new RegExp(key);
    Message.find({'target_id': req.session.user._id, 'has_read': false}).then(messages => {
        User.find({'xm':regExp}).then(searchUser=>{
            Question.find({'content':regExp}).populate('author').populate('forWard_author').then(searchQuestion=>{
                console.log(searchQuestion);
                res.render('search-content',{
                    title: '我的首页',
                    user:req.session.user,
                    messages:messages,
                    searchUser:searchUser,
                    searchQuestion:searchQuestion
                })
            })
        })
    })
}
