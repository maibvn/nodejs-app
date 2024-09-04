export const checkLoginStatus = async () => {
  let user = null;
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/auth/check-auth`,
    {
      method: "GET",
      credentials: "include", // Ensure cookies are sent with the request
    }
  );
  if (response.status === 401) {
    return user;
  } else {
    const data = await response.json();
    user = data.user; // Store user data in state
  }
  return user;
};
