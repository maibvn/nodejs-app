import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { checkLoginStatus } from "../utils/checkUser";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //Check if user has filled in the form or not
  const [isTouched, setIsTouched] = useState(false);
  const [isAccValid, setIsAccValid] = useState(true);
  const navigate = useNavigate();

  //Save input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let isValid = true;
  const { email, password } = formData;
  if (isTouched) {
    isValid = email.trim().includes("@") && password.trim().length > 8;
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await checkLoginStatus();
      if (!user || user?.role === "client") {
        return;
      }
      if (user?.role === "clientSupport") {
        navigate("/client-support");
      } else if (user?.role === "admin") {
        navigate("/dashboard");
      }
    };
    getUser();
  }, []);

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
          // dispatch(login(data.user));
          const userRole = data.role;
          if (userRole === "clientSupport") {
            navigate("/client-support");
          } else {
            navigate("/dashboard");
          }
          window.location.reload();
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
      <div className={classes.loginContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.title}>Welcome!</div>
          {!isAccValid && isTouched && (
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

          {formData.password?.trim().length < 9 && isTouched && (
            <p>Please enter a valid password.</p>
          )}

          <button disabled={!isValid}>SIGN IN</button>
        </form>
      </div>
    </>
  );
}

export default Login;
