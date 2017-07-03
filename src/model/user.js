import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import validator from 'validator'

import config from '../config'

let Schema = mongoose.Schema

let UserSchema = new Schema({
    // User First Name
    firstName: {
        type: String,
        required: true
    },
    // User Last Name
    lastName: {
        type: String,
        required: true
    },
    // User Password
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // User Email
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
// Performed before every 'save' function
UserSchema.pre('save', function(next){
    // Save current User
    let user = this
    // Check if Password was modified or if User is new
    if(this.isModified('password') || this.isNew) {
        // Generage salt
        bcrypt.genSalt(10, function(err, salt) {
            // Check for any errors
            if(err) {
                return next(err)
            }
            // Hash user password
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
// Used to compare passwords
UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        // Check for any errors
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}
// JSON format for return messages
UserSchema.methods.toJSON = function() {
    let user = this
    let userObj = user.toObject()

    return _.pick(userObj, ['_id', 'email'])
}
// Used to generate JWT Auth Token
UserSchema.methods.generateAuthToken = function() {
    let user = this
    let token = jwt.sign({ _id: user._id.toHexString() }, config.secrets.jwtSecret, { expiresIn: 7200 }).toString()

    return token
}

UserSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', UserSchema)