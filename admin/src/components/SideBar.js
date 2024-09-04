import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onToogle, visible, user, onLogout }) => {
  const navigate = useNavigate();

  const logOutHandler = async () => {
    const url = "http://localhost:5000/api/auth/logout";
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        onLogout();
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!user) return;
  return (
    <div
      className={styles.sidebar}
      style={{ display: visible ? "block" : "none" }}
    >
      <ul>
        {user.role === "admin" && (
          <li
            onClick={() => {
              navigate("/dashboard");
              onToogle();
            }}
          >
            Dashboard
          </li>
        )}
        {user.role === "admin" && (
          <li
            onClick={() => {
              navigate("admin/product");
              onToogle();
            }}
          >
            Products
          </li>
        )}
        <li
          onClick={() => {
            navigate("client-support");
            onToogle();
          }}
        >
          Client Support
        </li>
        <li
          onClick={() => {
            logOutHandler();
          }}
        >
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
