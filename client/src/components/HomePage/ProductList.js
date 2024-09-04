import React from "react";
import classes from "./Banner.module.css";
import ProductItems from "./ProductItems";
import { useSelector } from "react-redux";

const ProductList = ({ productData }) => {
  return (
    <div className={classes.productList}>
      <div className={classes.headingContainer} id={classes.trend}>
        <div className={classes.text}>Made the hard way</div>
        <h2 className={classes.heading}>Top trending products</h2>
      </div>
      <div className={classes.productContainer}>
        {productData.length !== 0 &&
          productData.map((prod, i) => {
            return <ProductItems page="home" key={i} prod={prod} />;
          })}
      </div>
    </div>
  );
};
export default React.memo(ProductList);
