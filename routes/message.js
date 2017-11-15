const mapping = require('../static');
const Message = require('../models/Message');
exports.index = (req, res, next) => {
    Message.find({'target_id': req.session.user._id, 'has_read': false}).then(messages => {
        Message.find({
            'target_id': req.session.user._id,
            'type': 'reply',
            'has_read': false
        }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').then(reply => {
            Message.find({
                'target_id': req.session.user._id,
                'type': 'comment',
                'has_read': false
            }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').then(comment => {
                Message.find({
                    'target_id': req.session.user._id,
                    'type': 'at',
                    'has_read': false
                }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').populate('coment_id').then(at => {
                    Message.find({
                        'target_id': req.session.user._id,
                        'type': 'like',
                        'has_read': false
                    }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').populate('coment_id').then(like => {
                        Message.find({
                            'target_id': req.session.user._id,
                            'type': 'comment',
                            'has_read': true
                        }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').then(comments =>{
                            Message.find({
                                'target_id': req.session.user._id,
                                'type': 'reply',
                                'has_read': true
                            }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').then(replys=>{
                                Message.find({
                                    'target_id': req.session.user._id,
                                    'type': 'at',
                                    'has_read': true
                                }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').populate('coment_id').then(ats=>{
                                    Message.find({
                                        'target_id': req.session.user._id,
                                        'type': 'like',
                                        'has_read': true
                                    }).populate('question_id').populate('author_id').populate('target_id').populate('reply_id').populate('coment_id').then(likes=>{
                                        res.render('message', {
                                            title: '消息',
                                            layout: 'indexTemplate',
                                            resource: mapping.message,
                                            reply: reply,
                                            replys:replys,
                                            userId: req.session.user._id,
                                            messages: messages,
                                            comment: comment,
                                            comments:comments,
                                            at: at,
                                            ats:ats,
                                            like: like,
                                            likes:likes
                                        });
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
// 更新已读reply
exports.read_reply = (req, res, next) => {
    Message.updateMany({
        'target_id': req.session.user._id,
        'type': 'reply',
        'has_read': false
    }, {'has_read': true}).then(data => {
        return res.end('已读reply');
    })
}
// 更新已读comment
exports.read_comment = (req, res, next) => {
    Message.updateMany({
        'target_id': req.session.user._id,
        'type': 'comment',
        'has_read': false
    }, {'has_read': true}).then(data => {
        return res.end('已读comment')
    })
}
//更新at已读
exports.read_at = (req, res, next) => {
    Message.updateMany({
        'target_id': req.session.user._id,
        'type': 'at',
        'has_read': false
    }, {'has_read': true}).then(data => {
        return res.end('已读at')
    })
}
//更新like已读
exports.read_like = (req,res,next)=>{
    Message.updateMany({
        'target_id': req.session.user._id,
        'type': 'like',
        'has_read': false
    }, {'has_read': true}).then(data => {
        return res.end('已读like')
    })
}