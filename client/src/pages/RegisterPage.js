import React from "react";
import classes from "../components/LoginPage/Login.module.css";
import SignUpForm from "../components/LoginPage/SignUpForm";

const RegisterPage = () => {
  return (
    <>
      <div className={classes.loginContainer}>
        <SignUpForm />;
      </div>
    </>
  );
};
export default RegisterPage;
