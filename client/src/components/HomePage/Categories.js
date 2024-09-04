import React from "react";
import classes from "./Banner.module.css";
import image1 from "../../img/product_1.png";
import image2 from "../../img/product_2.png";
import image3 from "../../img/product_3.png";
import image4 from "../../img/product_4.png";
import image5 from "../../img/product_5.png";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  //HOMEPAGE category
  const navigate = useNavigate();
  const handleClick = () => {
    return navigate("/shop");
  };
  return (
    <>
      <div className={classes.categories}>
        <div className={classes.headingContainer}>
          <div className={classes.text}>Carefully created collections</div>
          <h2 className={classes.heading}>Browse our categories</h2>
        </div>
        <div>
          <div className={classes.imgContainer1}>
            <img onClick={handleClick} src={image1} alt="Category-1" />
            <img onClick={handleClick} src={image2} alt="Category-2" />
          </div>
          <div className={classes.imgContainer2}>
            <img onClick={handleClick} src={image3} alt="Category-3" />
            <img onClick={handleClick} src={image4} alt="Category-4" />
            <img onClick={handleClick} src={image5} alt="Category-5" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
