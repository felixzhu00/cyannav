const date = new Date(Date.now());

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectID, 
        ref: "userProfileSchema", 
        required: [true, "no author given"]
    },
    childComments: [
        {
            type: Schema.Types.ObjectID, 
            ref: "commentSchema", 
            default: [],
        },
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectID, 
            ref: "userProfileSchema", 
            default: [],
        },
    ],
    upvotes: [
        {
            type: Schema.Types.ObjectID, 
            ref: "userProfileSchema", 
            default: [],
        },
    ],
    ask_date: {
        type: Date,
        default: date,
    },

});

const commentModel = mongoose.model("commentModel", commentSchema);
module.exports = commentModel;