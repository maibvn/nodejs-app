import { SHOW_POPUP, HIDE_POPUP } from "./popupAction";

const initialState = {
  showPopUp: false,
  productShown: {},
};

//SWITCH 2 CASES to SHOW and HIDE popup
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POPUP:
      return {
        ...state,
        showPopUp: true,
        productShown: action.payload,
      };
    case HIDE_POPUP:
      return {
        ...state,
        showPopUp: false,
        // productShown: state,
      };
    default:
      return state;
  }
};

export default productReducer;
