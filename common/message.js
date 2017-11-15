const Message = require('../models/Message');
const _ = require('lodash');
const message = {
    sendAtMessage:(targetId,questionId,authorId,replyId,commentId,callback)=>{
        callback = callback || _.noop;
        let newMessage = new Message();
        newMessage.type = 'at';
        newMessage.target_id = targetId;
        newMessage.question_id = questionId;
        newMessage.author_id = authorId;
        newMessage.reply_id = replyId;
        newMessage.comment_id = commentId;
        newMessage.save((err,msg)=>{
            return callback(null,msg);
        })
    },
    sendReplyMessage:(targetId,authorId,questionId,replyId)=>{
        let newMessage = new Message();
        newMessage.type = 'reply';
        newMessage.target_id = targetId;
        newMessage.author_id = authorId;
        newMessage.question_id = questionId;
        newMessage.reply_id = replyId;
        newMessage.save();
    },
    sendCommentMessage:(targetId,authorId,questionId,replyId)=>{
        let newMessage = new Message();
        newMessage.type = 'comment';
        newMessage.target_id = targetId;
        newMessage.author_id = authorId;
        newMessage.question_id = questionId;
        newMessage.reply_id = replyId;
        newMessage.save();
    },
    sendLikeMessage:(targetId,authorId,questionId,replyId)=>{
        let newMessage = new Message();
        newMessage.type = 'like';
        newMessage.target_id = targetId;
        newMessage.author_id = authorId;
        newMessage.question_id = questionId;
        newMessage.reply_id = replyId;
        newMessage.save();
    }

}
module.exports = message
