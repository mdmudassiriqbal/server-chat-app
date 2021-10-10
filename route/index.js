const express = require("express");
const router = express.Router();
const controller = require("../controller/chat");
const userController = require('../controller/user')

router.get("/test", controller.test);
router.post("/add", controller.saveRoom);
router.get("/rooms/:username", controller.getRooms);
router.patch("/room", controller.unSetNewMsg);
router.get("/message/:room", controller.getMessages);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/user',userController.getAllUser);
router.get('/room-list/:channel',controller.getListByChannel);
router.post('/add-room-user',controller.addRoomAndUser);
router.post('/increase-msgcount',controller.increaseMsgCount);
router.post('/delete-chat', controller.deleteChat);

module.exports = router;
