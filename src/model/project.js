import mongoose from 'mongoose'

let Schema = mongoose.Schema

let ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgsUrls: {
        type: [String]
    }
})

module.exports = mongoose.model('Project', ProjectSchema)