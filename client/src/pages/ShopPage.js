import React, { useEffect, useState } from "react";
import CategoryList from "../components/ShopPage/CategoryList";
import { useDispatch, useSelector } from "react-redux";
import classes from "../components/ShopPage/ShopPage.module.css";
import { fetchData } from "../utils/fetchData";
import { useLoaderData } from "react-router-dom";
import { generateImgLinks } from "../utils/generateImgLink";

const ShopPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.shop.products);

  useEffect(() => {
    dispatch({ type: "SHOW_ALL_PROD" });
  }, []);

  return (
    <>
      <div className={classes.banner}>
        <h1>SHOP</h1>
        <h5>SHOP</h5>
      </div>
      {products && products.length > 0 && (
        <div className={classes.cateContainer}>
          <CategoryList productData={products} />
        </div>
      )}
    </>
  );
};

export default ShopPage;
