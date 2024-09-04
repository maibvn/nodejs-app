import { ON_LOGIN, ON_LOGOUT } from "./actionTypes";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_LOGIN:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case ON_LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default authReducer;
