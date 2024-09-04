import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../components/HomePage/Banner";
import Categories from "../components/HomePage/Categories";
import ProductList from "../components/HomePage/ProductList";
import Information from "../components/HomePage/Information";
import Popup from "../components/HomePage/Popup";
import { useLoaderData } from "react-router-dom";
// import { updateShop } from "../store/shop/shopAction";

const Homepage = () => {
  const data = useLoaderData();
  const dispatch = useDispatch();
  const productData = data.products;

  useEffect(() => {
    if (productData) {
      dispatch({
        type: "UPDATE_SHOP",
        data: productData,
      });
    }
  }, [data]);

  const isPopUp = useSelector((state) => state.productModal.showPopUp);
  const productShown = useSelector((state) => state.productModal.productShown);
  return (
    <>
      <Banner />
      <Categories />
      <ProductList productData={productData} />
      <Information />
      {isPopUp && <Popup prod={productShown} />}
    </>
  );
};
export default Homepage;
