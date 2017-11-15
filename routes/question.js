const mapping = require('../static');
const Question = require('../models/Question');
const Reply = require('../models/Reply');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const message = require('../common/message');
const at = require('../models/at');
exports.index = (req, res, next) => {
    //@内容名字暂时没加超链接，需要的话换个编辑器!
    let id = req.params.id;
    let message_id = req.session.user._id;
    Question.findOne({'_id': id}).populate('author').populate('forWard_author').then(question => {
        Reply.find({'question_id': question._id}).sort({'create_time': -1}).populate('author').then(replys => {
            User.findOne({'_id': req.session.user._id}).then(user => {
                Message.find({'target_id': message_id, 'has_read': false}).then(messages => {
                    res.render('question', {
                        title: '微博详情',
                        layout: 'indexTemplate',
                        resource: mapping.question,
                        question: question,
                        replys: replys,
                        user: user,
                        messages: messages
                    })
                })
            })
        })
    }).catch(err => {
        console.log(err);
    })
}
exports.question_likes = (req, res, next) => {
    let question_id = req.params.question_id;
    let user_id = req.session.user._id;
    Question.findOne({'_id': question_id}).then(question => {
        User.findOne({'_id': user_id}).then(user => {
            let index = question.like_num.indexOf(user_id);
            let likeIndex = req.session.user.liked.indexOf(question._id);
            if (index == -1) {
                question.like_num.push(user_id);
                user.liked.push(question._id);
                if (question.author != user_id) {
                    message.sendLikeMessage(question.author, user_id, question._id, []);
                }
            } else {
                question.like_num.splice(index, 1);
                user.liked.splice(likeIndex, 1);
            }
            user.save();
            question.save().then(question => {
                res.render('question_likes', {
                    question: question,
                    layout: ''
                })
            }).catch(err => {
                console.log(err);
            })
        })
    })
}
exports.forWard = (req, res, next) => {
    let question_id = req.params.question_id;
    let content = req.body.content;
    let user_id = req.session.user._id;
    Question.findOne({'_id': question_id}).then(question => {
        let newQuestion = new Question();
        newQuestion.content = question.content;
        newQuestion.imgs = question.imgs;
        newQuestion.forWard_author = req.session.user._id;
        newQuestion.forWard_content = content;
        newQuestion.author = question.author;
        newQuestion.save(
            at.sendMessageToMentionUsers(content, newQuestion._id, req.session.user._id, null, null, (err, msg) => {
                if (err) {
                    console.log(err);
                }
                return question;
            })).then(question=>{
                User.findOne({'_id':user_id}).then(user=>{
                    user.article_count += 1;
                    user.save();
                })
            return;
        }).then(data => {
            return res.json({
                message: 'success'
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}