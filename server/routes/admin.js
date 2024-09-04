const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", adminController.getProducts);

router.put("/product/edit/:prodId", adminController.updateProduct);

router.delete("/product/delete/:prodId", adminController.deleteProduct);

router.get("/orders", adminController.getOrders);

router.post("/add-product", adminController.postAddProduct);

router.post("/upload", (req, res) => {
  const imgUrls = req.files.map((img) => img.path);
  res
    .status(200)
    .json({ message: "Files uploaded successfully", imgUrls: imgUrls });
});

module.exports = router;
