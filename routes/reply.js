const validator = require('validator');
const Reply = require('../models/Reply');
const Question = require('../models/Question');
const Comment = require('../models/Comment');
const at = require('../models/at');
const message = require('../common/message');
const User = require('../models/User');
exports.reply = (req, res, next) => {
    // 微博id
    let question_id = req.params.id;
    // 微博内容
    let content = req.body.content;
    content = validator.trim(String(content));
    if (content === '') {
        return res.end('内容不能为空');
    } else {
        let newReply = new Reply();
        newReply.content = content;
        newReply.question_id = question_id;
        newReply.author = req.session.user._id;
        newReply.save().then(reply => {
            return reply
        }).then(reply => {
            //3.给当前@的人发送消息，里面不包含作者
            Question.findOne({'_id': reply.question_id}).populate('author').then(question => {
                let author_xm = question.author.xm;
                let regex = new RegExp('@' + author_xm + '\\b(?!\\])', 'g');
                let newContent = content.replace(regex, '');
                at.sendMessageToMentionUsers(newContent, question._id, req.session.user._id, reply._id, null, (err, msg) => {
                    if (err) {
                        res.end(err);
                    }
                })
            })
            return reply
        }).then(reply => {
            Question.findOne({'_id': reply.question_id}).populate('author').then(question => {
                message.sendReplyMessage(question.author._id, req.session.user._id, question._id, reply._id);
                question.click_num += 1;
                question.save();
            })
            return reply;
        }).then(reply => {
            Reply.findOne({'_id': reply._id}).populate('author').then(reply => {
                res.render('addReply', {
                    reply: reply,
                    layout: ''
                })
            })
        })
    }
}
exports.comment = (req, res, next) => {
    let content = req.body.content;//二级回复内容
    let reply_id = req.body.reply_id;//对应一级回复
    let comment_target_id = req.body.comment_target_id; //回复的人
    let question_id = req.params.id;//问题的ID
    let author = req.session.user._id; //作者
    if (content.length <= 0) {
        res.json({message: '长度不能为空'});
    } else {
        let newComment = new Comment();
        newComment.content = content;
        newComment.reply_id = reply_id;
        newComment.question_id = question_id;
        newComment.author = author;
        newComment.comment_target_id = comment_target_id;
        newComment.save().then(comment => {
            return comment
        }).then(comment => {
            Question.findOne({'_id': comment.question_id}).populate('author').then(question => {
                Comment.findOne({'_id': comment._id}).populate('reply_id').then(theComment => {
                    if (theComment.reply_id.author != theComment.author) {
                        message.sendCommentMessage(theComment.reply_id.author, theComment.author, theComment.question_id, theComment.reply_id);
                    }
                    question.click_num += 1;
                    question.save();
                })
            })
            return comment
        }).then(comment => {
            Reply.findOne({'_id': reply_id}).populate('author').populate('question_id').then(reply => {
                reply.comment_num += 1;
                reply.save();
            })
            return comment
        }).then(comment => {
            Comment.findOne({'_id': comment._id}).populate('reply_id').populate('comment_target_id').populate('question_id').populate('author').then(comment => {
                let queryArray = [];
                if (comment.question_id.author == comment.reply_id.author) {
                    queryArray.push(comment.question_id.author);
                } else {
                    queryArray.push(comment.question_id.author);
                    queryArray.push(comment.reply_id.author);
                }
                User.find({'_id': {$in: queryArray}}).then(authors => {
                    let newContent = null;
                    if (authors.length == 1) {
                        let author_name = authors[0].name;
                        let regex1 = new RegExp('@' + author_name + '\\b(?!\ \])', 'g')
                        newContent = content.replace(regex1, '')
                    } else if (authors.length == 2) {
                        let author_name = authors[0].name;
                        let reply_name = authors[1].name;
                        let regex1 = new RegExp('@' + author_name + '\\b(?!\ \])', 'g')
                        let regex2 = new RegExp('@' + reply_name + '\\b(?!\\])', 'g');
                        newContent = content.replace(regex1, '').replace(regex2, '');
                    }
                    at.sendMessageToMentionUsers(newContent, comment.question_id._id, comment.author._id, comment.reply_id._id, comment._id, (err, msg) => {
                        if (err) {
                            return res.end(err);
                        }
                    })
                })
            })
            return comment;
        }).then(comment => {
            Comment.findOne({'_id': comment._id}).populate('author').populate('reply_id').then(comment => {
                res.render('addComment', {
                    comment: comment,
                    layout: ''
                })
            })
        }).catch(err => {
            console.log(err);
        })
    }
}
exports.allComment = (req, res, next) => {
    let reply_id = req.params.reply_id;
    let id = req.session.user._id;
    Reply.findOne({'_id': reply_id}).populate('author').then(reply => {
        Comment.find({'reply_id': reply_id}).sort({'create_time': -1}).populate('author').populate('comment_target_id').then(comments => {
            res.render('comments', {
                comments: comments,
                reply: reply,
                layout: ''
            })
        })
    })
}
exports.reply_likes = (req, res, next) => {
    let reply_id = req.params.reply_id;
    let user_id = req.session.user._id;
    let liked = false;
    Reply.findOne({'_id': reply_id}).then(reply => {
        let index = reply.likes.indexOf(user_id)
        if (index == -1) {
            liked = true;
            reply.likes.push(user_id);
            reply.likes.forEach(function (userId) {
                message.sendLikeMessage(reply.author, userId, reply.question_id, reply._id);
            });
        } else {
            liked = false;
            reply.likes.splice(index, 1);
        }
        reply.save().then(reply => {
            res.render('reply_likes', {
                reply: reply,
                layout: '',
                liked: liked
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}
exports.comment_likes = (req, res, next) => {
    let comment_id = req.params.comment_id;
    let user_id = req.session.user._id;
    Comment.findOne({'_id': comment_id}).then(comment => {
        let index = comment.likes.indexOf(user_id);
        if (index == -1) {
            comment.likes.push(user_id);
            comment.likes.forEach(function (userId) {
                message.sendLikeMessage(comment.author, userId, comment.question_id, comment.reply_id);
            })
        } else {
            comment.likes.splice(index, 1);
        }
        comment.save().then(comment => {
            res.render('comment_likes', {
                comment: comment,
                layout: ''
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}
