const Chat = require("../model/chatModel");
const User = require("../model/UserModel");



const asccessChat = async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    try {
        // var isChat = await Chat.find({
        //     isGroupChat: false, $and: [
        //         { users: { $elemMatch: { $eq: req.user._id } } },
        //         { users: { $elemMatch: { $eq: userId } } }
        //     ]
        // }).populate("users", "-password").populate("letestMessage")
        // isChat = await User.populate(isChat, {
        //     path: "letestMessage.sender",
        //     select: "name pic email"
        // })

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("users", "-password").populate("latestMessage");
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        if (isChat.length > 0) {
            res.json(isChat[0])
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };
            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
                res.status(200).json({ succes: 1, message: "Chat Successfully", chat: FullChat })
            } catch (error) {
                res.status(400).json({ succes: 0, message: "Something went wrong" })
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: chatController.js:56 ~ asccessChat ~ error:", error.message)
        res.status(400).json({ succes: 0, message: "Something went wrong" })

    }
}

const fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password").sort({ updateAt: -1 }).then(async (data) => {
            data = await User.populate(data, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).json({ succes: 0, message: "Something went wrong" })
    }
}

const createGroupChat = async (req, res) => {
    const { user, name } = req.body
    if (!user || !name) {
        res.status(400).json({ message: "Please Fill all the details" })
    }
    var users = JSON.parse(req.body.user);
    if (users.length < 2) {
        res.status(400).json({ message: "More than 2 users require in group chat" })
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {

    }
}

const renamegroup = async (req, res) => {
    const { chatId, chatName } = req.body
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        // const updategroup = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true }).populate("users", "-password")
        //     .populate("groupAdmin", "-password");
        if (!updatedChat) {
            res.status(400).json({ message: "not Updated" })
        } else {
            res.status(200).json(updatedChat)
        }
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" })
    }
}
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body
    try {
        const removeuser = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId }
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!removeuser) {
            res.status(400).json({ message: "not Updated" })
        } else {
            res.status(200).json(removeuser)
        }
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" })
    }
}
const addtogroup = async (req, res) => {
    const { chatId, userId } = req.body
    try {
        const addeduser = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!addeduser) {
            res.status(400).json({ message: "not Updated" })
        } else {
            res.status(200).json(addeduser)
        }
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" })
    }
}

module.exports = { asccessChat, fetchChat, createGroupChat, renamegroup, removeFromGroup, addtogroup }