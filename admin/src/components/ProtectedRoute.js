import { checkLoginStatus as userLoader } from "../utils/checkUser";
import React, { useState, useEffect } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
// import useLoaderData from ""

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await userLoader();

        setUser(user);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "10rem" }}>Loading...</div>
    );
  }

  if (!loading && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
