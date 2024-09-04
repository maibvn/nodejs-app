import React from "react";
import classes from "./ShopPage.module.css";
import ProductItems from "../HomePage/ProductItems";
import Pagination from "./Pagination";

const CategoryProductList = ({ data }) => {
  const productData = data;

  return (
    <>
      <div className={classes.categoryProdContainer}>
        <div>
          <input placeholder="Enter Search Term" />
        </div>
        <div className={classes.sortButton}>
          {/* <select value={sortOrder} onChange={handleSort}> */}
          <select>
            <option value="default">Default Sorting</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className={classes.productList}>
          <div className={classes.productContainer} key={Math.random()}>
            {productData.length !== 0 &&
              productData.map((prod, i) => {
                return <ProductItems page="category" key={i} prod={prod} />;
              })}
          </div>
        </div>
      </div>
      <Pagination pageNum={data.length} />
    </>
  );
};
export default CategoryProductList;
