import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import classes from "./DetailPage.module.css";
import Button from "../Button";

function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1);

  // Function to increase the quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to decrease the quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  if (product.count === 0) return;
  return (
    <div className={classes.quantitySelector}>
      <input
        placeholder="QUANTITY"
        type="number"
        readOnly
        min="1"
        style={{ padding: "10px", position: "relative" }}
      />
      <div className={classes.quantityChange}>
        <FontAwesomeIcon
          icon={faCaretLeft}
          className={classes.icon}
          onClick={decreaseQuantity}
        />
        <div style={{ display: "inline-block", fontStyle: "normal" }}>
          {quantity}
        </div>
        <FontAwesomeIcon
          onClick={increaseQuantity}
          icon={faCaretRight}
          className={classes.icon}
        />
      </div>
      <Button method="ADD_ITEM_QUAN" prod={product} quantity={quantity}>
        Add to Cart
      </Button>
    </div>
  );
}

export default AddToCart;
