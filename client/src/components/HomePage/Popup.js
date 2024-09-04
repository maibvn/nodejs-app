import React from "react";
import classes from "./Popup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const Popup = (props) => {
  //Get product's info
  const { prod } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Dispatch Action HIDE_POPUP
  const hidePopUpHandler = () => {
    dispatch({ type: "HIDE_POPUP" });
  };

  //Convert price to 100.000 format
  const priceNum = Number(prod.price).toLocaleString("id-ID");
  //Truncate func to shorten description to 700 letters
  const trunDes =
    prod.long_desc.length > 700
      ? prod.long_desc.substring(0, 700) + "..."
      : prod.long_desc;

  return (
    <>
      <div className={classes.modalOverlay} onClick={hidePopUpHandler}>
        <div className={classes.modalContent}>
          <button className={classes.closeButton}>X</button>

          {/* <img src={prod.img1} alt="product-img" /> */}
          <div className={classes.imageContainer}>
            <img src={prod.img1} alt="product" />
            {prod.count === 0 && (
              <img
                src={process.env.REACT_APP_OUT_OF_STOCK_IMG_URL}
                alt="Out of Stock"
                className={classes.outOfStock}
              />
            )}
          </div>
          <div className={classes.modalDetail}>
            <h3>{prod.name}</h3>
            <h5 className={classes.price}>{priceNum} VND</h5>
            <p>{trunDes}</p>

            <button
              onClick={() => {
                navigate(`/detail/${prod._id}`);
              }}
            >
              View Detail
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default React.memo(Popup);
