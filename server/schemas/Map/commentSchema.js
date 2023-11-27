const date = new Date(Date.now())

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectID,
        ref: "userProfile",
        required: [true, "no author given"],
    },
    childComments: [
        {
            type: Schema.Types.ObjectID,
            ref: "comment",
            default: [],
        },
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfile",
            default: [],
        },
    ],
    upvotes: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfile",
            default: [],
        },
    ],
    ask_date: {
        type: Date,
        default: date,
    },
    text: {
        type: String,
        required: true,
    },
})

const commentModel = mongoose.model("comment", commentSchema)
module.exports = commentModel
