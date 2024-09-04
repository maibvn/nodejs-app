import React from "react";
import styles from "./ViewOrderModal.module.css"; // Import the CSS module

const ViewModal = ({ isOpen, onClose, orderData }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>User</th>
              <th>Product X Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{orderData._id}</td>
              <td>{orderData.user.fullName}</td>
              <td>
                {orderData.products.map((p) => {
                  return (
                    <div key={Math.random()}>
                      {p.product.name} x {p.quantity}
                    </div>
                  );
                })}
              </td>
              <td>
                {orderData.products.map((p) => {
                  return (
                    <div key={Math.random()}>
                      {(p.product.price * p.quantity).toLocaleString()} VND
                    </div>
                  );
                })}
              </td>
              <td>{orderData.totalPrice.toLocaleString()} VND</td>
              <td>{orderData.orderStatus}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewModal;
