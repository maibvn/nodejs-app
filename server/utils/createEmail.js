function generateOrderHtml(emailData) {
  const productsHtml = emailData.products
    .map(
      (product) => `
    <tr style="text-align: center;">
      <td style="border: 1px solid white; color: white;">${product.name}</td>
      <td style="border: 1px solid white; color: white;"><img src="${
        product.image
      }" width="60" height="60" alt="${product.name}"/></td>
      <td style="border: 1px solid white; color: white;">${product.price.toLocaleString()} VND</td>
      <td style="border: 1px solid white; color: white;">${
        product.quantity
      }</td>
      <td style="border: 1px solid white; color: white;">${(
        product.price * product.quantity
      ).toLocaleString()} VND</td>
    </tr>
  `
    )
    .join("");

  return `
<div style="background-color: #1D1E1F; color: white; font-family: Arial, sans-serif; padding: 20px;">
  
  <h1 style="color: white;">Xin Chào ${emailData.userName}</h1>
  <p style="color: white;">Phone: ${emailData.userPhone}</p>
  <p style="color: white;">Address: ${emailData.userAdress}</p>
  <table style="width: 100%; border-collapse: separate; border: 1px solid white;">
    <thead>
      <tr>
        <th style="border: 1px solid white; color: white; padding: 8px;">Tên Sản Phẩm</th>
        <th style="border: 1px solid white; color: white; padding: 8px;">Hình Ảnh</th>
        <th style="border: 1px solid white; color: white; padding: 8px;">Giá</th>
        <th style="border: 1px solid white; color: white; padding: 8px;">Số Lượng</th>
        <th style="border: 1px solid white; color: white; padding: 8px;">Thành Tiền</th>
      </tr>
    </thead>
    <tbody>
      ${productsHtml}
    </tbody>
  </table>
  <h1 style="margin-bottom: 0; color: white;"><strong>Tổng thanh toán:</strong></h1>
  <h1 style="margin-top: 0; color: white;"><strong>${emailData.totalPrice.toLocaleString()} VND</strong></h1>
  <h1 style="color: white;"><strong>Cảm ơn bạn</strong></h1>
</div>
  `;
}

module.exports = { generateOrderHtml };
