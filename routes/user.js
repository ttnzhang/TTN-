const mapping = require('../static');
var db = require('../models/db');
const User = require('../models/User');
const auth = require('../models/auth');
const formidable = require('formidable');
const Question = require('../models/Question');
const moment = require('moment');
const Message = require('../models/Message');
const validator = require('validator');
const fs = require('fs');
const gm = require('gm');
const followUser = require('../models/FollowUser');
exports.setting = (req, res, next) => {
    let id = req.session.user._id;
    Message.find({'target_id': id, 'has_read': false}).then(messages => {
        User.findOne({'_id': id}).then(user => {
            res.render('setting', {
                title: '个人设置',
                layout: 'indexTemplate',
                resource: mapping.setting,
                user: user,
                messages: messages
            })
        })
    })
}
exports.center = (req, res, next) => {
    // 当前页面用户的xm
    let xm = req.params.xm;
    // 当前登录用户的name
    let username = req.session.user.name;
    let message_id = req.session.user._id
    User.findOne({'xm': xm}).then(users => {
        let funame = users.name;
        let id = users._id;
        let fld = false;
        followUser.findOne({'user_name': funame}).then(followings => {
            if (followings.following.indexOf(username) == -1) {
                fld = false;
            } else {
                fld = true;
            }
            followUser.findOne({'user_name': username}).then(followeds => {
                Question.find({'author': id}).sort({'create_time': -1}).populate('author').populate('forWard_author').then(questions => {
                    Question.find({'forWard_author': id}).sort({'create_time': -1}).populate('author').populate('forWard_author').then(forWardQuestion => {
                        Message.find({'target_id': message_id, 'has_read': false}).then(messages => {
                            res.render('center', {
                                title: '个人中心',
                                layout: 'indexTemplate',
                                resource: mapping.center,
                                users: users,
                                questions: questions,
                                followings: followings,
                                followeds: followeds,
                                fld: fld,
                                username: username,
                                messages: messages,
                                forWardQuestion: forWardQuestion
                            })
                        })
                    })
                })
            })
        })
    }).catch(err => {
        console.log(err);
    })
}
exports.updateUser = (req, res, nex) => {
    let id = req.params.id;
    let xm = req.body.xm;
    let motto = req.body.motto;
    let job = req.body.job;
    let avatar = req.body.avatar;
    let error;
    if (!validator.isLength('motto', 0)) {
        error = '个性签名不能为空';
    }
    if (!validator.isLength('avatar', 0)) {
        error = '头像的地址不能为空';
    }
    if (!validator.isLength('xm'), 0) {
        error = '昵称不能为空';
    }
    if (!validator.isLength('job'), 0) {
        error = '职业信息不能为空';
    }
    if (error) {
        return res.end(error);
    } else {
        User.findOne({'_id': id}).then(user => {
            if (!user) {
                return res.end('用户名不存在');
            }
            user.update_time = new Date();
            user.xm = xm;
            user.avatar = avatar;
            user.job = job;
            user.motto = motto;
            user.save().then(user => {
                req.session.user = user;
                return res.end('success');
            }).catch((err) => {
                return res.end(err);
            })
        })
    }
}
//更新头像的处理函数
exports.updateImage = (req, res, next) => {
    //初始化
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/upload/images/';
    let updatePath = 'public/upload/images/';
    let smallImgPath = "public/upload/smallimgs/";
    let files = [];
    let fields = [];
    form.on('field', function (field, value) {
        fields.push([field, value]);
    }).on('file', function (field, file) {
        //文件的name值
        //console.log(field);
        //文件的具体信息
        //console.log(file);
        files.push([field, file]);
        let type = file.name.split('.')[1];
        let date = new Date();
        let ms = moment(date).format('YYYYMMDDHHmmss').toString();
        let newFileName = 'img' + ms + '.' + type;
        fs.rename(file.path, updatePath + newFileName, function (err) {
            var input = updatePath + newFileName;
            var out = smallImgPath + newFileName;
            gm(input).resize(100, 100, '!').autoOrient().write(out, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('done');
                    //压缩后再返回，否则的话，压缩会放在后边，导致链接失效
                    return res.json({
                        error: '',
                        initialPreview: ['<img src="' + '/upload/images/' + newFileName + '">'],
                        url: out
                    })
                }
            });
        })
    })
    form.parse(req);
}
exports.followWeibo = (req, res, next) => {
    let questionId = req.params.question_id;
    let user = req.session.user;
    User.findOne({'_id': user._id}).then(user => {
        Question.findOne({'_id': questionId}).then(question => {
            let index = user.followWeibo.indexOf(questionId);
            let index_id = question.follow_num.indexOf(user._id);
            if (index == -1) {
                user.followWeibo.push(questionId);
                user.save().then(data => {
                    return res.json({message: 'followed'})
                })
                question.follow_num.push(user._id);
                question.save();
            } else {
                user.followWeibo.splice(index, 1);
                user.save().then(data => {
                    return res.json({message: 'unfollow'})
                })
                question.follow_num.splice(index_id, 1);
                question.save();
            }
        }).catch(err => {
            return res.end('err')
        })
    })
}