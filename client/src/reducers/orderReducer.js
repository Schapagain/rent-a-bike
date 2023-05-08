import {
  ADD_ORDER,
  ADD_BIKE_TO_ORDER,
  REMOVE_BIKE_FROM_ORDER,
  CLEAR_CART,
  SET_DELIVERY_TIME,
  SET_DELIVERY_TYPE,
} from "../actions/types";
import { Order } from "../utils/order";

const initialState = {
  order: new Order(JSON.parse(localStorage.getItem("order"))),
  userId: localStorage.getItem("userId"),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ORDER: // will use this later
      return state;
    case ADD_BIKE_TO_ORDER:
    case REMOVE_BIKE_FROM_ORDER:
    case SET_DELIVERY_TIME:
    case SET_DELIVERY_TYPE:
      localStorage.setItem("order", action.payload.jsonStringifiedOrder);
      return {
        ...initialState,
        order: action.payload,
      };
    case CLEAR_CART:
      localStorage.removeItem("order");
      return {
        ...state,
        order: new Order(),
      };

    default:
      return state;
  }
}
