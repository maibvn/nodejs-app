import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const logOutHandler = async () => {
    const url = "http://localhost:5000/api/auth/logout";
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <h2 style={{ textAlign: "center", padding: "200px" }}>
        Sorry! You're not authorized! ☹
        <br />
        Log in with admin or client support account!
        <br />
        <button
          onClick={logOutHandler}
          style={{ marginTop: "2rem", backgroundColor: "green" }}
        >
          Move to Login Page
        </button>
      </h2>
    </>
  );
};

export default ErrorPage;
