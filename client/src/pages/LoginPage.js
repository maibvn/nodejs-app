import React from "react";
import classes from "../components/LoginPage/Login.module.css";
import SignInForm from "../components/LoginPage/SignInForm";

const LoginPage = () => {
  return (
    <>
      <div className={classes.loginContainer}>
        <SignInForm />
      </div>
    </>
  );
};
export default LoginPage;
