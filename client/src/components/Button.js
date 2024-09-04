import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../store/cart/cartAction";

const Button = (props) => {
  const { method, disabled, prod, quantity } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Handle click base on method
  const handleClick = (method) => {
    if (method === "browse") {
      return navigate("/shop");
    }
    //For POP UP in Homepage, default quantity is 1
    if (method === "ADD_TO_CART") {
      dispatch(addCart(prod, 1));
    }
    //For Detail Page, customized quantity
    if (method === "ADD_ITEM_QUAN") {
      dispatch(addCart(prod, quantity));
    }
  };
  return (
    <>
      <button
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => handleClick(method)}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
