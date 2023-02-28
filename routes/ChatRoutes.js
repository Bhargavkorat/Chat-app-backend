const express = require('express');
const { asccessChat, fetchChat,createGroupChat, renamegroup, removeFromGroup, addtogroup } = require('../controller/chatController');
const routes = express.Router()
const auth = require("../middleware/auth")


routes.route("/").post(auth,asccessChat)
routes.route("/").get(auth,fetchChat)
routes.route("/group").post(auth,createGroupChat)
routes.route("/rename").put(auth,renamegroup)
routes.route("/groupremove").put(auth,removeFromGroup)
routes.route("/groupadd").put(auth,addtogroup)



module.exports = routes;