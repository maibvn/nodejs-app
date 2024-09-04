import React from "react";
import classes from "./DeleteProductModal.module.css";

const DeleteProductModal = ({ productId, productName, onClose, onReload }) => {
  const deleteHandler = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/product/delete/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Delete Product successfully");
        if (onClose) onClose();
        if (onReload) onReload();
      } else {
        alert(result.message);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <div className={classes.deleteModal}>
      <div className={classes.deleteModalContent}>
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the product{" "}
          <strong>{productName}</strong>?
        </p>
        <div className={classes.modalActions}>
          <button onClick={onClose} style={{ backgroundColor: "green" }}>
            Cancel
          </button>
          <button onClick={() => deleteHandler(productId)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
