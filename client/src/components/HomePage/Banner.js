import React from "react";
import classes from "./Banner.module.css";
import Button from "../Button";

const Banner = () => {
  return (
    <div className={classes.banner}>
      <div className={classes.container}>
        <div className={classes.text}>New inspiration 2020</div>
        <h1>20% off on new season</h1>
        <Button method={"browse"}>Browse collections</Button>
      </div>
    </div>
  );
};

export default Banner;
