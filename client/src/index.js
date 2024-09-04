import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import productReducer from "./store/popup/popupReducer";
import productListReducer from "./store/shop/shopReducer";
import authReducer from "./store/login/loginReducer";
import cartReducer from "./store/cart/cartReducer";

//Combine Reducers
const rootReducer = combineReducers({
  productModal: productReducer,
  shop: productListReducer,
  auth: authReducer,
  cart: cartReducer,
});
//Create Store with reducers
const store = createStore(rootReducer);

//Provide store
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
