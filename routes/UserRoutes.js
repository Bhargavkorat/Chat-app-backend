const express = require('express');
const { registeruser, loginuser, searchuser } = require('../controller/userController');
const routes = express.Router()
const upload = require("../middleware/imagesUpload")
const auth = require("../middleware/auth")


routes.post("/",upload.single("pic"),registeruser)
routes.route("/login").post(loginuser)
routes.route("/searchuser").get(auth, searchuser)



module.exports = routes;