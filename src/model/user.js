import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import validator from 'validator'

import config from '../config'

let Schema = mongoose.Schema

let UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    }
})

UserSchema.pre('save', function(next){
    let user = this
    if(this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
}) 

UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

UserSchema.methods.toJSON = function() {
    let user = this
    let userObj = user.toObject()

    return _.pick(userObj, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function() {
    let user = this
    let token = jwt.sign({ _id: user._id.toHexString() }, config.secrets.jwtSecret, { expiresIn: 7200 }).toString()

    return token
}

UserSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', UserSchema)