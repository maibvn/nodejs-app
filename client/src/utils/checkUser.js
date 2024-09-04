export const checkLoginStatus = async () => {
  let user = null;
  const response = await fetch("http://localhost:5000/api/auth/check-auth", {
    method: "GET",
    credentials: "include", // Ensure cookies are sent with the request
  });
  const data = await response.json();
  if (response.status === 401) {
    return user;
  } else {
    user = data.user; // Store user data in state
  }
  return user;
};
