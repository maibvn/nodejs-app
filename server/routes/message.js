const express = require("express");

const messageController = require("../controllers/message");

const router = express.Router();

router.get("/:roomId", messageController.getMessages);

router.get("/", messageController.getRoomIds);

module.exports = router;
