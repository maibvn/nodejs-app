import React, { useState } from "react";
import classes from "./Login.module.css";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/login/actions";

function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //Check if user has filled in the form or not
  const [isTouched, setIsTouched] = useState(false);
  const [isAccValid, setIsAccValid] = useState(false);
  //Warning section => EMAIL EXISTED
  const [hideWarn, setHideWarn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Save input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setHideWarn(false);
  };
  // Check valid input to enable submit button
  let isValid = true;
  const { email, password } = formData;
  if (isTouched) {
    isValid = email.trim().includes("@") && password.trim().length > 8;
  }
  //HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTouched(true);

    const postLogin = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 401) {
          setIsAccValid(false);
        }
        if (response.ok) {
          dispatch(login(data.user));
          window.location.assign("/");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (email.trim().includes("@") && password.trim().length > 8) {
      postLogin(formData);
    }
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.title}>Sign In</div>
        {!isAccValid && isTouched && hideWarn && (
          <p>Invalid email or password. Please try again!</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoFocus
        />

        {!formData.email?.trim().includes("@") && isTouched && (
          <p>Please enter a valid email!</p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {formData.password?.trim().length < 9 && isTouched && !hideWarn && (
          <p>Please enter a valid password.</p>
        )}

        <Button method="login" type="submit" disabled={!isValid}>
          SIGN IN
        </Button>
        <div style={{ fontSize: "18px" }}>
          Create an account?{" "}
          <a
            onClick={() => navigate("/register")}
            style={{ color: "blue", marginLeft: "8px", cursor: "pointer" }}
          >
            Sign up
          </a>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
