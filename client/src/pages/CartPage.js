import React, { useEffect, useState } from "react";
import classes from "../components/CartPage/CartPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  faTrashCan,
  faCaretLeft,
  faCaretRight,
  faGift,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  updateCart,
  updateQuantity,
} from "../store/cart/cartAction";

const CartPage = () => {
  const [isNotLogin, setIsNotLogin] = useState(false);
  const { user } = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Get Cart data from localStorage
  const latestCartState = JSON.parse(localStorage.getItem("latestCartState"));
  //Get Cart data from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    if (!user) {
      setIsNotLogin(true);
      return;
    }
    //Update Cart's lastest state from Local Storage
    if (latestCartState) {
      dispatch(updateCart(latestCartState.cartItems));
    }
  }, []);

  // Calculate total for each item and sum up all totals
  const subTotal = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);

  //Update Cart when click Caret < 1 >
  const handleQuantityChange = (item, quantity) => {
    dispatch(updateQuantity(item, quantity));
  };

  //Remove Item from Cart
  const handleRemoveItem = (itemId, productName) => {
    const confirm = window.confirm(
      `Remove ${productName.toUpperCase()} from the cart?`
    );
    if (confirm) {
      dispatch(deleteCart(itemId));
    }
  };
  if (isNotLogin) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        You need to log in to access this data!
      </p>
    );
  }
  return (
    <div className={classes.cart}>
      <div className={classes.banner}>
        <h1>CART</h1>
        <h5 style={{ color: "grey" }}>CART</h5>
      </div>
      <h3>Shopping cart</h3>
      <div className={classes.container}>
        <div className={classes.cartContainer}>
          <table className={classes.cartTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {/* Dynamically render cartItems */}
              {cartItems.map((item, i) => (
                <tr key={i}>
                  <td>
                    <img src={item.img1} alt={item.name} />
                  </td>
                  <td>{item.name}</td>
                  {/* Change 100000 to 100.000 */}
                  <td>{Number(item.price).toLocaleString("id-ID")} VND</td>
                  <td>
                    <div className={classes.quantityChange}>
                      <FontAwesomeIcon
                        icon={faCaretLeft}
                        className={classes.icon}
                        onClick={() => {
                          //Set up so user can't choose quantity < 1
                          if (item.quantity === 1) {
                            return;
                          } else handleQuantityChange(item, item.quantity - 1);
                        }}
                      />
                      <div
                        style={{ display: "inline-block", fontStyle: "normal" }}
                      >
                        {item.quantity}
                      </div>
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className={classes.icon}
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                      />
                    </div>
                  </td>
                  <td>
                    {Number(item.price * item.quantity).toLocaleString("id-ID")}
                    VND
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className={classes.icon}
                      onClick={() => handleRemoveItem(item._id, item.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={classes.cartTotal}>
          <h3>Cart total</h3>
          <div
            className={classes.totalFlex}
            style={{ borderBottom: "1px solid #ccc" }}
          >
            <h4>Subtotal</h4>
            <h6 className={classes.price}>
              {Number(subTotal).toLocaleString("id-ID")} VND
            </h6>
          </div>
          <div className={classes.totalFlex}>
            <h4>Total</h4>
            <h4 className={`${classes.price} ${classes.toTal} `}>
              {Number(subTotal).toLocaleString("id-ID")} VND
            </h4>
          </div>
          <div>
            <input type="text" placeholder="Enter Your Coupon"></input>
          </div>
          <button>
            <FontAwesomeIcon icon={faGift} className={classes.giftIcon} />
            Apply Coupon
          </button>
        </div>
        <div className={classes.cartNavi}>
          <button
            onClick={() => navigate("/shop")}
            style={{ cursor: "pointer", border: "none" }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ marginRight: "8px", marginLeft: "8px", color: "black" }}
            />
            Continue Shopping
          </button>
          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ marginLeft: "8px", color: "black" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
