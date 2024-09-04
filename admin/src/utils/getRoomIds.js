export const getRoomIds = async () => {
  let roomIds = [];
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/message/`,
    {
      method: "GET",
      credentials: "include", // Ensure cookies are sent with the request
    }
  );
  if (response.status === 401) {
    return roomIds;
  } else {
    const data = await response.json();
    roomIds = data.roomIds; // Store user data in state
  }
  return roomIds;
};
