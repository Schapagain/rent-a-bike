import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import bikeReducer from "./bikeReducer";
import orderReducer from "./orderReducer";
import paymentReducer from "./paymentReducer";

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  bike: bikeReducer,
  order: orderReducer,
  payment: paymentReducer,
});
