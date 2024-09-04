import { UPDATE_SHOP, FILTER, SHOW_ALL_PROD } from "./shopAction";

const initialState = {
  products: [],
  filteredProducts: [],
};

//SWITCH 3 CASES to Update, filter and show PRODUCTS
const productListReducer = (state = initialState, action) => {
  switch (action.type) {
    //FIRST render, update shop
    case UPDATE_SHOP:
      return {
        ...state,
        products: action.data ? action.data : state.products,
      };
    //FOR CATEGORY PAGE - Filter with required category
    case FILTER:
      const filteredProds = state?.products.filter(
        (prod) => prod.category === action.category
      );
      return {
        ...state,
        products: state.products,
        filteredProducts: filteredProds,
      };
    //FOR CATEGORY PAGE - Show all products
    case SHOW_ALL_PROD:
      return {
        ...state,
        products: state.products,
        filteredProducts: state.products,
      };
    default:
      return state;
  }
};

export default productListReducer;
