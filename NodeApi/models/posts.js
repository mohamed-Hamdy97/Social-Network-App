const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date
    },
    photo: {
        data: Buffer,
        contetType: String //file formate

    }
})

module.exports = mongoose.model('Post', PostSchema)