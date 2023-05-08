import axios from "axios";
import { ROOT_ENDPOINT } from "../utils/constants";
import { returnErrors } from "./errorActions";
import {
  ADD_ORDER,
  ADD_ORDER_FAIL,
  ADD_BIKE_TO_ORDER,
  REMOVE_BIKE_FROM_ORDER,
  SET_DELIVERY_TIME,
  SET_DELIVERY_TYPE,
} from "../actions/types";
import { tokenConfig } from "./shared";
import { Order } from "../utils/order";

export const addOrder = () => async (dispatch, getState) => {
  try {
    const endpoint = `${ROOT_ENDPOINT}/api/orders/`;
    const order = {
      user: getState().auth.user.id,
      bikes: getState().order.order.bikeIds,
      payment: getState().payment.confirmedPaymentIntent.payment_method,
      amount: getState().payment.amount,
      deliveryTime: getState().order.order.orderTime,
      type: getState().order.order.orderType,
    };
    const res = await axios.post(endpoint, order, tokenConfig(getState));

    dispatch({ type: ADD_ORDER, payload: res.data.order });
  } catch (err) {
    if (err.response) {
      dispatch(
        returnErrors(
          err.response.data.error,
          err.response.status,
          ADD_ORDER_FAIL
        )
      );
    }
    dispatch({ type: ADD_ORDER_FAIL });
  }
};

export const addBikeToOrder = (bike) => (dispatch, getState) => {
  let newOrder = new Order(getState().order.order.getOrderDetails());

  newOrder.addBike(bike);
  dispatch({
    type: ADD_BIKE_TO_ORDER,
    payload: newOrder,
  });
};

export const setDeliveryTime = (time) => (dispatch, getState) => {
  let newOrder = new Order(getState().order.order.getOrderDetails());

  newOrder.setTime(time);
  dispatch({
    type: SET_DELIVERY_TIME,
    payload: newOrder,
  });
};

export const setDeliveryType = (type) => (dispatch, getState) => {
  let newOrder = new Order(getState().order.order.getOrderDetails());

  newOrder.setType(type);
  dispatch({
    type: SET_DELIVERY_TYPE,
    payload: newOrder,
  });
};

export const removeBikeFromOrder = (id) => (dispatch, getState) => {
  let newOrder = new Order(getState().order.order.getOrderDetails());
  newOrder.removeBike(id);

  return dispatch({
    type: REMOVE_BIKE_FROM_ORDER,
    payload: newOrder,
  });
};
