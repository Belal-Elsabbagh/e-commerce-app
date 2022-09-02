let mongoose = require('mongoose')
let crypto = require('crypto')
const jsonwebtoken = require("jsonwebtoken");
const { jwtSecretKey } = require('../config');
const { errors: { InternalServerError } } = require('../types');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: { type: String, default: 'user' },
    password: String,
    timeCreated: { type: Date, default: Date.now() },
})

userSchema.pre('save', function (next) {
    const user = this
    let hashedPassword = hashPassword(user.password)
    if (user.isModified('password')) user.password = hashedPassword
    next()
})

userSchema.pre('findOne', function (next) {
    let userPassword = this._conditions.password
    if (this._conditions.hasOwnProperty('password')) this._conditions.password = hashPassword(userPassword)
    next()
})


userSchema.static('generateToken', function (userObject, expiresIn = '1h') {
    try {
        if (!(userObject._id && userObject.email && userObject.role)) throw new InternalServerError('Failed to generate token from this object')
        let data = {
            user: {
                id: userObject._id,
                email: userObject.email,
                role: userObject.role
            },
            tokenTimeCreated: Date.now()
        }
        return jsonwebtoken.sign(data, jwtSecretKey, { expiresIn: expiresIn })
    } catch (err) {
        throw err
    }
})

module.exports = mongoose.model('users', userSchema)