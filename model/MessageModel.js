const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageModelSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // content: {
    //     type: String,
    //     trim: true,
    // },
    // sender: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // chat: {
    //     type:Schema.Types.ObjectId,
    //     ref:"Chat"
    // }
}, {
    timestamps: true
})


const Message = mongoose.model("chatModel", MessageModelSchema)

module.exports = Message;