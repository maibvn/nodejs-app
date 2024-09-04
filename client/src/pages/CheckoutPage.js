import React, { useEffect, useRef, useState } from "react";
import classes from "../components/CheckOutPage/CheckOut.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { updateCart } from "../store/cart/cartAction";

const CheckoutPage = () => {
  const [validForm, setValidForm] = useState(false);
  const [isNotLogin, setIsNotLogin] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const { user } = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      setIsNotLogin(true);
      return;
    }
    const latestCartState = JSON.parse(localStorage.getItem("latestCartState"));
    //Update Cart's lastest state from Local Storage
    if (latestCartState) {
      dispatch(updateCart(latestCartState.cartItems));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fullNameRef.current.value = user.fullName || "";
      emailRef.current.value = user.email || "";
      phoneNumRef.current.value = user.phone || "";
      addressRef.current.value = user.address ? user.address : "";
    }
  }, [user]);

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumRef = useRef(null);
  const addressRef = useRef(null);

  //Get Cart data from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);
  //Calculate total for each item and sum up all totals
  const subTotal = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);

  const checkValid = (form) => {
    let formIsValid = false;
    if (
      form.name.trim().length !== 0 &&
      form.email.trim().length !== 0 &&
      form.email.includes("@") &&
      form.phoneNum !== 0 &&
      form.address.trim().length !== 0
    ) {
      formIsValid = true;
    }
    return formIsValid;
  };
  //Submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    setIsTouched(true);

    const formData = {
      name: fullNameRef.current.value,
      email: emailRef.current.value,
      phoneNum: Number(phoneNumRef.current.value),
      address: addressRef.current.value,
    };
    const isValid = checkValid(formData);

    if (!isValid) {
      setValidForm(false);
    } else {
      setIsTouched(false);

      //Handle Order Data
      let prodsInCart = [];
      let totalPrice = 0;
      for (const prod of cartItems) {
        const updatedProd = { product: prod._id, quantity: prod.quantity };
        totalPrice += prod.price * prod.quantity;
        prodsInCart.push(updatedProd);
      }
      const orderData = {
        user: user._id,
        products: prodsInCart,
        totalPrice: totalPrice,
      };
      //Handle Email Data
      let prodsInfo = [];
      for (const prod of cartItems) {
        const updatedProdInfo = {
          name: prod.name,
          image: prod.img1,
          price: prod.price,
          quantity: prod.quantity,
        };
        prodsInfo.push(updatedProdInfo);
      }

      const emailData = {
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phoneNum,
        userAdress: formData.address,
        products: prodsInfo,
        totalPrice: totalPrice,
      };
      const postOrder = async () => {
        const url = "http://localhost:5000/api/shop/order";
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              orderData: orderData,
              emailData: emailData,
            }),
          });

          if (response.ok) {
            alert(
              "Order successful! Thank you for your purchase. Please check your email for more information."
            );
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      postOrder();
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
    <>
      <div className={classes.banner}>
        <h1>CHECKOUT</h1>
        <div className={classes.subBanner}>
          <h5>HOME / </h5>
          <h5>CART / </h5>
          <h5 style={{ color: "grey" }}>CHECKOUT</h5>
        </div>
      </div>
      <h4 style={{ marginBottom: "18px" }}>BILLING DETAILS</h4>
      <div className={classes.billingContainer}>
        <div className={classes.billing}>
          {isTouched && !validForm && (
            <p style={{ textAlign: "center", color: "red" }}>
              Please fill in the field with the correct information!
            </p>
          )}
          <form>
            <div className={classes.formGroup}>
              <label htmlFor="fullName" className={classes.label}>
                Full Name:
              </label>
              <input
                type="text"
                id="fullName"
                placeholder={"Enter your full name here!"}
                className={classes.input}
                ref={fullNameRef}
                defaultValue={user ? user.fullName : ""}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email" className={classes.label}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder={"Enter your email here!"}
                className={classes.input}
                ref={emailRef}
                defaultValue={user ? user.email : ""}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="phoneNumber" className={classes.label}>
                Phone Number:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className={classes.input}
                placeholder={"Enter your phone number here!"}
                ref={phoneNumRef}
                defaultValue={user ? user.phone : ""}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="address" className={classes.label}>
                Address:
              </label>
              <input
                type="teet"
                id="address"
                placeholder="Enter your address here!"
                className={classes.input}
                ref={addressRef}
                defaultValue={user && user.address ? user.address : ""}
              />
            </div>
            <button
              type="submit"
              className={classes.submitButton}
              onClick={submitHandler}
            >
              Place Order
            </button>
          </form>
        </div>
        <div className={classes.order}>
          <h3 style={{ paddingBottom: "18px" }}>YOUR ORDER</h3>
          {/* Render DATA */}
          {cartItems.map((item, i) => {
            return (
              <div className={classes.container} key={i}>
                <div
                  style={{
                    fontWeight: "500",
                    width: "200px",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ color: "grey" }}>
                  {Number(item.price).toLocaleString("id-ID")} VND x{" "}
                  {item.quantity}
                </div>
              </div>
            );
          })}
          <div
            className={classes.container}
            style={{
              border: "none",
            }}
          >
            <h5 style={{ fontWeight: "500" }}>TOTAL</h5>
            <h5 style={{ color: "grey" }}>
              {Number(subTotal).toLocaleString("id-ID")} VND
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};
export default CheckoutPage;
