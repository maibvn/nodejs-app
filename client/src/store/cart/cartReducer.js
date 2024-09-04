import {
  ADD_CART,
  DELETE_CART,
  UPDATE_CART,
  UPDATE_QUANTITY,
} from "./cartAction";

//Func to save to Local Storage
const saveToLocalStorage = (state, updatedCart) => {
  localStorage.setItem(
    "latestCartState",
    JSON.stringify({
      ...state,
      cartItems: updatedCart,
    })
  );
};

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    //FOR POP UP IN HOMEPAGE + DETAIL PAGE
    case ADD_CART: {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          JSON.stringify(item._id) === JSON.stringify(action.payload.item._id)
      );
      let updatedCartItems;
      if (itemIndex !== -1) {
        //Item already exists in cart, update quantity
        updatedCartItems = state.cartItems.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Item doesn't exist in cart, add with quantity
        updatedCartItems = [
          ...state.cartItems,
          { ...action.payload.item, quantity: action.payload.quantity },
        ];
      }
      saveToLocalStorage(state, updatedCartItems);
      return { ...state, cartItems: updatedCartItems };
    }

    //FOR CART PAGE
    case UPDATE_QUANTITY: {
      const updatedCartItems = state.cartItems.map((item) =>
        JSON.stringify(item._id) === JSON.stringify(action.payload.item._id)
          ? { ...item, quantity: action.payload.newQuantity }
          : item
      );
      saveToLocalStorage(state, updatedCartItems);
      return { ...state, cartItems: updatedCartItems };
    }

    //FOR CART PAGE
    case DELETE_CART: {
      const updatedCartItems = state.cartItems.filter(
        (item) => JSON.stringify(item._id) !== JSON.stringify(action.payload)
      );
      saveToLocalStorage(state, updatedCartItems);
      return { ...state, cartItems: updatedCartItems };
    }
    //FOR RELOADING PAGE - SAVE CART STATE FROM LS
    case UPDATE_CART: {
      saveToLocalStorage(state, action.payload);
      return { ...state, cartItems: action.payload };
    }

    default:
      return state;
  }
};

export default cartReducer;
