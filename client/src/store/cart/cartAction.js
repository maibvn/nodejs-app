//TYPES
export const ADD_CART = "ADD_CART";
export const DELETE_CART = "DELETE_CART";
export const UPDATE_CART = "UPDATE_CART";
export const UPDATE_QUANTITY = "UPDATE_QUANTITY";

//ACTIONS
export const addCart = (item, quantity) => ({
  type: ADD_CART,
  payload: { item, quantity },
});
export const updateQuantity = (item, newQuantity) => ({
  type: UPDATE_QUANTITY,
  payload: { item, newQuantity },
});
export const deleteCart = (itemId) => ({
  type: DELETE_CART,
  payload: itemId,
});
export const updateCart = (items) => ({
  type: UPDATE_CART,
  payload: items,
});
