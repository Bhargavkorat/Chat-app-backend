const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatModelSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    // chatName: {
    //     type: String,
    //     trim: true,
    // },
    // isGroupChat: {
    //     type: Boolean,
    //     default: false
    // },
    // users: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // }],
    // letestMessage:{
    //     type: Schema.Types.ObjectId,
    //     ref: "Message"
    // },
    // groupAdmin:{
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // }
}, {
    timestamps: true
})


const Chat = mongoose.model("Chat", ChatModelSchema)

module.exports = Chat;