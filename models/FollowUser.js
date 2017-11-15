const mongoose = require('mongoose')
const User = require('../models/User');
const shortid = require('shortid');
const Schema =  mongoose.Schema;
const FollowUserSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    user_name: {
        type: String,
        required: true
    },
    followed: {
        type: [String],
    },
    following: {
        type: [String],
    }
});
const FollowUser = mongoose.model('FoolowUser', FollowUserSchema);
module.exports = FollowUser;