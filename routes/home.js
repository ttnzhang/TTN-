/**
 * Create by Aoao at 2017/10/27
 */
const mapping = require('../static');
// 验证模块
const validator = require('validator');
// 引入数据库表
const db = require('../models/db');
// 引入配置文件
const setting = require('../setting');
// 引入User表
const User = require('../models/User');
//引入问题表
const Question = require('../models/Question');
//引入回复表
const Reply = require('../models/Reply');
// 引入权限的文件
const auth = require('../models/auth');
// 上传头像文件
const at = require('../models/at');
const followUser = require('../models/FollowUser');
const Message = require('../models/Message');
const formidable = require('formidable');
const moment = require('moment');
const fs = require('fs');
const gm = require('gm');
exports.index = (req, res, next) => {
    if (req.session.user) {
        let name = req.session.user.name;
        let id = req.session.user._id;
        followUser.findOne({'user_name': name}).then(followeds => {
            Question.find().sort({'create_time': -1}).populate('author').populate('forWard_author').then(question => {
                Message.find({'target_id': id, 'has_read': false}).then(messages => {
                    User.findOne({'_id':id}).then(user=>{
                        Question.find({'_id':user.liked}).populate('author').populate('forWard_author').then(likeQuestion=>{
                            Question.find({'_id':user.followWeibo}).populate('author').populate('forWard_author').then(followQuestion=>{
                                question.forEach(function (theQuestion) {
                                    if (theQuestion.author.followWeibo.indexOf(question._id) != -1) {
                                        theQuestion.author.following = true;
                                    }else{
                                        theQuestion.author.following = false;
                                    }
                                })
                                res.render('index', {
                                    title: '我的首页',
                                    layout: 'indexTemplate',
                                    resource: mapping.index,
                                    question: question,
                                    followeds: followeds,
                                    messages: messages,
                                    likeQuestion:likeQuestion,
                                    followQuestion:followQuestion
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        Question.find().sort({'create_time': -1}).populate('author').populate('forWard_author').then(question => {
            res.render('index', {
                title: '我的首页',
                layout: 'indexTemplate',
                resource: mapping.index,
                question: question,
            })
        })
    }
}
exports.login = (req, res, next) => {
    res.render('login', {
        title: '登录',
        layout: 'indexTemplate',
        resource: mapping.login
    })
}
exports.postlogin = (req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;
    let error;
    //1.判断用户名是否合法
    if (name) {
        if (!validator.matches(name, /^[a-zA-Z0-9_]{4,11}$/, 'g')) {
            error = '用户名不合法';
        }
    }
    //3.验证密码
    if (!validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/, 'g') ||
        !validator.isLength(password, 5, 12)) {
        error = '密码不合法,长度在5-12位,请重新输入'
    }
    if (error) {
        return res.end(error);
    } else {
        User.findOne({'name': name}).then(user => {
            let newPSD = db.encrypt(password, setting.psd);
            if (user == null) {
                return res.end('用户名不存在');
            } else if (user.password != newPSD) {
                return res.end('密码不正确');
            }
            //生成cookie
            auth.gen_session(user, res);
            return res.end('success');
        })
    }
}
exports.postregister = (req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let error;
    // 后端验证用户名
    if (!validator.matches(name, /^[a-zA-Z0-9_]{4,11}$/, 'g')) {
        error = '用户名不合法,5-12位,数字字母下划线,请重新输入'
    }
    // 密码
    if (!validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/, 'g') ||
        !validator.isLength(password, 5, 12)) {
        error = '密码不合法,长度在5-12位,请重新输入'
    }
    // 邮箱验证
    if (!validator.isEmail(email)) {
        error = '邮箱格式不合法,请重新输入';
    }
    if (error) {
        return res.end(error);// 如果上述验证失败，就直接将失败的提示消息发给前端.
    } else {
        // 验证成功了
        User.find().or([{name: name}, {email: email}]).exec().then(user => {
            if (user.length > 0) {
                // 找到这个用户了，说明它以前注册过
                error = '不允许重复注册，请重新填写注册信息'
                return res.end(error);
            } else {
                let newPSD = db.encrypt(password, setting.psd);
                req.body.password = newPSD;
                let newUser = new User();
                newUser.name = name;
                newUser.xm = name;
                newUser.password = newPSD;
                newUser.email = email;
                newUser.save().then(() => {
                    let newFollowUser = new followUser();
                    newFollowUser.user_name = name;
                    newFollowUser.save();
                }).then(data => {
                    return res.json({
                        message: 'success'
                    })
                }).catch(err => {
                    return res.json({
                        message: err
                    })
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }
}
exports.register = (req, res, next) => {
    res.render('register', {
        title: '注册',
        layout: 'indexTemplate',
        resource: mapping.register
    })
}
exports.logout = (req, res, next) => {
    //清除session
    req.session.destroy()
    //cookie删除
    res.clearCookie(setting.auth_name);
    res.redirect('/');
}
exports.updatePhoto = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/upload/photos/';
    let updatePath = 'public/upload/photos/';
    let smallImgPath = "public/upload/smallphotos/";
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
                        initialPreview: ['<img src="' + '/upload/photos/' + newFileName + '">'],
                        url: out
                    })
                }
            });
        })
    })
    form.parse(req);
}
exports.create = (req, res, next) => {
    let id = req.session.user._id
    let content = req.body.content;
    let photos = JSON.parse(req.body.photos);
    let newQuestion = new Question();
    newQuestion.content = content;
    newQuestion.imgs = photos;
    newQuestion.following = false;
    newQuestion.author = req.session.user._id;
    newQuestion.save(
        at.sendMessageToMentionUsers(content, newQuestion._id, req.session.user._id, null, null, (err, msg) => {
            if (err) {
                console.log(err);
            }
            return;
        })).then(question => {
        User.findOne({"_id": id}).then(user => {
            user.article_count += 1;
            user.save();
        })
    }).then(data => {
        return res.json({
            message: 'success'
        });
    }).catch(err => {
        return res.json({
            message: err
        })
    })
}
exports.showSectionReply = (req, res, next) => {
    let question_id = req.params.question_id;
    if (req.session.user) {
        let id = req.session.user._id;
        User.findOne({'_id': id}).then(user => {
            Reply.find({'question_id': question_id}).sort({'create_time': -1}).populate('author').limit(6).then(replys => {
                Question.findOne({'_id': question_id}).then(question => {
                    res.render('showSectionReply', {
                        user: user,
                        replys: replys,
                        question: question,
                        layout: ''
                    })
                })
            })
        })
    }
}