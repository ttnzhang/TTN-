/**
 * Create by Aoao at 2017/10/27
 */
// 路由文件
const express = require('express');
const router = express.Router();
// 引入处理函数
const home = require('./routes/home');
const user = require('./routes/user');
const question = require('./routes/question');
const message = require('./routes/message');
//引入一级回复的处理函数
const reply = require('./routes/reply');
const search = require('./routes/search');
//引入权限文件
const auth = require('./models/auth');
// 引入关注文件
const followUser = require('./routes/followuser');
//关注
router.post('/center/:name/followUser',auth.userRequired,followUser.follow)
//收藏
router.post('/:question_id/followWeibo',auth.userRequired,user.followWeibo)
// 首页
router.get('/', home.index);
//显示部分评论
router.get('/:question_id/sectionReply', home.showSectionReply);
//上传照片
router.post('/updatePhoto', home.updatePhoto);
//新建问题
router.post('/create',home.create);
//转发微博
router.post('/:question_id/forWard', question.forWard);
//登录
router.get('/login', auth.userNotRequired,home.login);
router.post('/login',auth.userNotRequired,home.postlogin)
//注册
router.get('/register', auth.userNotRequired,home.register);
router.post('/register',auth.userNotRequired,home.postregister);
//退出
router.get('/logout',home.logout);
//个人设置
router.get('/setting',auth.userRequired, user.setting);
//更新个人资料
router.post('/updateUser/:id', auth.userRequired, user.updateUser);
//更新头像
router.post('/updateImage',auth.userRequired,user.updateImage);
//个人中心
router.get('/center/:xm',auth.userRequired, user.center);
//微博详情
router.get('/question/:id', question.index);
//消息页面
router.get('/message', message.index);
//一级回复
router.post('/question/:id/reply', reply.reply);
//二级回复
router.post('/question/:id/comment', reply.comment);
//显示2条二级回复
router.get('/:reply_id/allComment', reply.allComment);
//文章点赞
router.post('/:question_id/question_likes', question.question_likes);
//一级回复点赞
router.post('/:reply_id/reply_likes', reply.reply_likes);
//二级回复点赞
router.post('/:comment_id/comment_likes', reply.comment_likes);
//reply已读
router.post('/message/:id/read_reply',message.read_reply);
//comment已读
router.post('/message/:id/read_comment', message.read_comment);
//at已读
router.post('/message/:id/read_at', message.read_at);
//like已读

router.post('/message/:id/read_like', message.read_like);
//搜索行为
router.post('/search/:key', search.find);

module.exports = router;