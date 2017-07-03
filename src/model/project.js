import mongoose from 'mongoose'

let Schema = mongoose.Schema

let ProjectSchema = new Schema({
    // Project Name
    name: {
        type: String,
        required: true
    },
    // Project Status
    status: {
        type: String,
        required: true
    },
    // Project Description
    description: {
        type: String,
        required: true
    },
    // Project Images
    imgsUrls: {
        type: [String]
    }
})

module.exports = mongoose.model('Project', ProjectSchema)