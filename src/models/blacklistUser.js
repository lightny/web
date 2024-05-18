const { model, Schema } = require('mongoose');

let blacklistUser = new Schema({
    User: String,
    Reason: String
});

module.exports = model('blacklistUser', blacklistUser);