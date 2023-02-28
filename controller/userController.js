const User = require("../model/UserModel");
const bcrypt = require('bcrypt');

const registeruser = async (req, res) => {
    const { name, email, password } = req.body
    const pic = req?.file?.path
    if (!name || !email || !password) {
        res.status(400).json({ Success: 0, message: "Please Enter all the Fields" })
    }

    try {
        const UserExist = await User.exists({ email })
        if (!UserExist) {
            const insertuser = await User.create({ name, email, password, pic })
            if (insertuser) {
                res.status(200).json({
                    Success: 1,
                    message: "User Register Successfully",
                    _id: insertuser._id,
                    name: insertuser.name,
                    email: insertuser.email,
                    pic: insertuser.pic,
                })
            } else {
                res.status(400).json({ Success: 0, message: "User Not Found" })
            }
        } else {
            res.status(400).json({ Success: 0, message: "User Already exist" })
        }

    } catch (error) {
        console.log("🚀 ~ file: userController.js:32 ~ registeruser ~ error:", error.message)
        res.status(400).json({ Success: 0, message: "Something went wrong" })
    }
}

const loginuser = async (req, res) => {
    const { email, password } = req.body
    try {
        const data = await User.findOne({ email: email });
        if (data) {
            const isMatch = await bcrypt.compare(password, data.password)
            if (isMatch) {
                const token = await data.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    httpOnly: true
                })
                res.status(200).json({ message: "Login Succesfully", success: 1, User: data })
            }
        } else {
            res.status(400).json({ message: "Please try to login with correct credentials", success: 0 })
        }

    } catch (error) {
        console.log("🚀 ~ file: userController.js:53 ~ loginuser ~ error:", error.message)
        res.status(400).json({ Success: 0, message: "Something went wrong" })

    }
}

const searchuser = async (req, res) => {
    const keyword = req?.query?.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {}

    try {
        const users = await  User.find(keyword).find({ _id:{$ne: req?.user?._id}})
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ Success: 0, message: "Something went wrong" })
    }
}

module.exports = { registeruser, loginuser, searchuser }

