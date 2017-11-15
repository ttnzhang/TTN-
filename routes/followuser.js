const FollowUser = require('../models/FollowUser');
const User = require('../models/User');
exports.follow = (req,res,next)=>{
    // 关注人的name
    let name = req.params.name;
    // 当前用户的信息
    let userid = req.session.user._id;
    let username = req.session.user.name;
    if (name == username) {
        return res.end('不能关注自己');
    }else{
        User.getUserById(userid,(err,user)=>{
            if (user) {
                FollowUser.findOne({'user_name': username}).then(follow => {
                    if (follow.followed == '') {
                        follow.followed.push(name);
                        follow.save();
                        return res.end('follow');
                    } else {
                        let index = follow.followed.indexOf(name);
                        if (index == -1) {
                            follow.followed.push(name);
                            follow.save();
                            return res.end('follow');
                        } else {
                            follow.followed.splice(index, 1);
                            follow.save();
                            return res.end('unfollow');
                        }
                    }
                });
                FollowUser.findOne({'user_name': name}).then(follow => {
                    if (follow.following == '') {
                        follow.following.push(username);
                        follow.save();
                        return res.end('follow');
                    } else {
                        let index = follow.following.indexOf(username);
                        if (index == -1) {
                            follow.following.push(username);
                            follow.save();
                            return res.end('follow');
                        } else {
                            follow.following.splice(index, 1);
                            follow.save();
                            return res.end('unfollow');
                        }
                    }
                });
            }
        })
    }
}