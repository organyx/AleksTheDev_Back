import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

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
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', UserSchema)