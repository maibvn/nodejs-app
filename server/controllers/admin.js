const Product = require("../models/product");
const User = require("../models/user"); // Assuming you have a User model
const Order = require("../models/order"); // Assuming you have an Order model
const moment = require("moment"); // Moment.js for date manipulation

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((prods) => {
      res
        .status(200)
        .json({ message: "Get products successfully", products: prods });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    });
};

exports.updateProduct = async (req, res, next) => {
  const { _id, name, price, category, count } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          price,
          category,
          count,
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.prodId;
    // Check if the product is part of any orders
    const ordersWithProduct = await Order.find({
      "products.product": productId,
    });
    if (ordersWithProduct.length > 0) {
      return res.status(400).json({
        message: "Cannot delete product: It is included in one or more orders",
      });
    }
    // Proceed with deleting the product if it's not in any orders
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");

    // Number of users
    const totalUsers = await User.countDocuments({ role: "client" });

    // Get the first day of the latest month and the current date
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    // Filter orders for the latest month
    const ordersInLatestMonth = orders.filter(
      (order) => order.date >= startOfMonth && order.date <= endOfMonth
    );

    // Calculate total earnings in the latest month
    const totalEarnings = ordersInLatestMonth.reduce((total, order) => {
      return total + order.totalPrice; // Assuming you have a totalAmount field
    }, 0);

    // Number of new orders in the latest month
    const totalNewOrders = ordersInLatestMonth.length;

    res.status(200).json({
      message: "Get orders successfully",
      orders: orders,
      totalUsers: totalUsers,
      totalEarnings: totalEarnings,
      totalNewOrders: totalNewOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    // Destructure the product data from the request body
    const {
      name,
      price,
      count,
      category,
      short_desc,
      long_desc,
      img1,
      img2,
      img3,
      img4,
      img5,
    } = req.body;
    // Validate required fields
    console.log(count);
    if (
      !name ||
      !price ||
      !count ||
      !category ||
      !short_desc ||
      !long_desc ||
      !img1
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new product document
    const newProduct = new Product({
      name,
      price,
      count,
      category,
      short_desc,
      long_desc,
      img1,
      img2,
      img3,
      img4,
      img5,
    });

    // Save the product to the database
    await newProduct.save();

    // Send a success response
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
