const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const path = require("path");
const { createOrderPDF } = require("../utils/createOrderPDF");
const { generateOrderHtml } = require("../utils/createEmail");

const transporter = nodemailer.createTransport({
  service: "gmail",
  // port: 587,
  // secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "buimo.newvision@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

exports.getProducts = (req, res, next) => {
  Product.find()
    .sort({ createdAt: -1 })
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

exports.createOrders = async (req, res, next) => {
  const { orderData, emailData } = req.body;
  const { user, products, totalPrice } = orderData;

  try {
    // Iterate over each product in the order and update the count in the database
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .send(`Product with ID ${item.product} not found`);
      }
      // Update the product count
      product.count -= item.quantity;
      if (product.count < 0) {
        return res
          .status(400)
          .send(`Not enough stock for product ${product.name}`);
      }

      await product.save();
    }

    // Save the order to the database
    const order = new Order({
      user,
      products,
      totalPrice,
    });

    const savedOrder = await order.save();

    // Update useradress since it's not in sign in model
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { address: emailData.userAdress, $push: { orders: savedOrder._id } },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    //---------------------------------------------------------//
    //Creating PDF to attach with Email
    createOrderPDF(emailData, savedOrder._id);
    //Creating Email HTML
    const htmlContent = generateOrderHtml(emailData);
    //SEND EMAIL
    const info = await transporter.sendMail({
      from: "buimo.newvision@gmail.com", // sender address
      // to: "vjtkhongcanh93@gmail.com", // list of receivers
      to: emailData.userEmail, // list of receivers
      subject: "Your Order Confirmation",
      text: "Please find your order details attached.",
      html: htmlContent,
      attachments: [
        {
          filename: `order-${savedOrder._id}.pdf`,
          path: path.join(
            __dirname,
            "../data/orders",
            `order-${savedOrder._id}.pdf`
          ),
        },
      ],
    });
    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "Ordered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res, next) => {
  const userId = req.session.userId;

  const findOrdersByUserId = async (userId) => {
    try {
      // Fetch orders for the user
      const orders = await Order.find({ user: userId }).exec();
      return orders;
    } catch (err) {
      throw new Error("Error fetching orders or user");
    }
  };
  try {
    const orders = await findOrdersByUserId(userId);

    res.status(200).json({
      message: "Get orders successfully",
      orders: orders,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId).populate("products.product");
    res.status(200).json({
      message: "Get order successfully",
      order,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
