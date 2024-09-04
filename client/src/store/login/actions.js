import { ON_LOGIN, ON_LOGOUT } from "./actionTypes";

export const login = (user) => ({
  type: ON_LOGIN,
  payload: user,
});

export const logout = () => ({
  type: ON_LOGOUT,
});
