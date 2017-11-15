const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const routes = require('./routes')
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const partials = require('express-partials');
//引入setting配置文件
const setting = require('./setting');
//引入权限文件
const auth = require('./models/auth');



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(setting.cookie_secret));
//使用session
app.use(session({
    secret: 'zhangzhidong',//作为服务器端生成session的签名
    resave: false,//当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存
    saveUninitialized: true//初始化session时是否保存到存储
}))
//通过cookie去生成session的方法
app.use(auth.authUser);
//将session信息保存在本地
app.use((req,res,next)=>{
    res.locals.user = req.session.user;
    if (req.session.has_message != '') {
        res.locals.has_message = true;
    }else{
        res.locals.has_message = false;
    }
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(routes);



app.listen(4000, () => {
    console.log('node is ok');
})

module.exports = app;
