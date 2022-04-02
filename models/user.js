const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        lowercase: true,
        unique: true,
        type: String
    },
    username: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)