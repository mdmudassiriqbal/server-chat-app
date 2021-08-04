const express = require('express');
const router = express.Router();
const controller = require('../controller/chat');

router.get('/test',controller.test);
router.post('/add',controller.saveMessages);
router.get('/rooms',controller.getRooms);
router.patch('/room',controller.unSetNewMsg);
router.get('/message/:room',controller.getMessages);
module.exports = router;