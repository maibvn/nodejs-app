//Func to check if email registered exists or not
export const checkEmail = (newEmail) => {
  const userArrLocalStorage = JSON.parse(localStorage.getItem("userArr"));
  let hasSameEmail;
  if (userArrLocalStorage && userArrLocalStorage.length > 0) {
    hasSameEmail = userArrLocalStorage.some((user) => user.email === newEmail);
  } else {
    hasSameEmail = false;
  }
  return hasSameEmail;
};
