const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function createOrderPDF(emailData, savedOrder) {
  const orderName = "order-" + savedOrder._id + ".pdf";
  const orderPath = path.join("data", "orders", orderName);

  // Create a new PDF document
  const doc = new PDFDocument();

  // Pipe the PDF to a file
  doc.pipe(fs.createWriteStream(orderPath));

  doc.font(path.join(__dirname, "../fonts/calibri.ttf"));
  // Title
  doc.fontSize(20).text("Order Summary", { align: "center" });
  doc.text("------------------------------------------------------------", {
    align: "center",
  });
  doc.moveDown();

  // Customer Info
  doc.fontSize(16).text(`Xin chào ${emailData.userName}`);
  doc.text(`Số điện thoại: ${emailData.userPhone}`);
  doc.text(`Địa chỉ: ${emailData.userAdress}`);
  doc.moveDown();

  doc.fontSize(14);
  doc.moveDown();

  // Loop through products and process them one by one
  for (const product of emailData.products) {
    try {
      doc.fontSize(15);
      doc.text(`Tên sản phẩm: ${product.name}`);
      doc.fontSize(14);
      // Product Price
      doc.text(
        `Giá: ${product.price.toLocaleString()} VND    X    SL: ${
          product.quantity
        }    =    `,
        {
          continued: true,
        }
      );
      // Total Product Price
      const totalProductPrice = product.price * product.quantity;
      doc.text(`${totalProductPrice.toLocaleString()} VND`);

      doc.moveDown();
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  }

  // Total Price
  doc.moveDown();
  doc.fontSize(20);
  doc.text(`Tổng thanh toán: ${emailData.totalPrice.toLocaleString()} VND`);
  doc.moveDown();
  doc.text(`Cảm ơn bạn!`);

  // Finalize the PDF and end the stream
  doc.end();
}

module.exports = { createOrderPDF };
