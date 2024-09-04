import React from "react";
import classes from "./Banner.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductItems = (props) => {
  const { prod, page } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Convert price to 100.000 form
  const priceNum = Number(prod.price).toLocaleString("id-ID");

  //Dispatch Action SHOW_POPUP
  const clickHandler = (prod) => {
    //HOMEPAGE - SHOW POPUP
    if (page === "home") {
      dispatch({ type: "SHOW_POPUP", payload: prod });
    } else if (page === "category") {
      //SHOP-PAGE - Navgigate
      navigate(`/detail/${prod._id}`);
    }
  };

  return (
    <div>
      <div
        className={classes.imageContainer}
        onClick={() => clickHandler(prod)}
      >
        <img src={prod.img1} alt="product" />
        {prod.count === 0 && (
          <img
            src={process.env.REACT_APP_OUT_OF_STOCK_IMG_URL}
            alt="Out of Stock"
            className={classes.outOfStock}
          />
        )}
      </div>
      <h4>{prod.name}</h4>
      <div className={classes.price}>{prod.price.toLocaleString()} VND</div>
    </div>
  );
};

export default React.memo(ProductItems);
