import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { checkLoginStatus } from "../utils/checkUser";
import Sidebar from "./SideBar";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const user = await checkLoginStatus();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user || user?.role === "client") {
      return;
    }
    if (user?.role === "clientSupport") {
      navigate("/client-support");
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const layoutStyle = {
    display: "flex",
  };

  const contentStyle = {
    flexGrow: 1,
  };

  const buttonStyle = {
    backgroundColor: sidebarVisible ? "#2c3e50" : "white",
    color: sidebarVisible ? "white" : "#2c3e50",
    padding: "26px 8px",
    paddingTop: "26px",
    cursor: "pointer",
    display: "inline-block",
  };
  const onLogout = () => {
    setHideNav(true);
  };

  return (
    <div style={layoutStyle}>
      {user && !hideNav && (
        <div style={buttonStyle} onClick={toggleSidebar}>
          <div>&#9776;</div> {/* Three-line button */}
        </div>
      )}
      {!hideNav && (
        <Sidebar
          visible={sidebarVisible}
          onToogle={toggleSidebar}
          user={user}
          onLogout={onLogout}
        />
      )}

      <main style={contentStyle}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
