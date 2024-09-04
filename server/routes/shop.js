const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getProducts);

router.post("/order", shopController.createOrders);

router.get("/order/:orderId", shopController.getOrder);

router.get("/order", shopController.getOrders);

module.exports = router;
