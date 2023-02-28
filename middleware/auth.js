require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");


const authSchema = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
            if (decoded) {
                await User.findOne({ _id: decoded?._id }).select("-password").then((result) => {
                    req.user = result;
                    next();
                })
            } else {
                return res.status(401).josn({
                    message: "Invalid token!"
                })
            }
        });

    } catch (error) {
        res.status(400).send('Not Match Data');
    }
};

module.exports = authSchema;