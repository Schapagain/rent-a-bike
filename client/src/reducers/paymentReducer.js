import {
  CREATE_PAYMENT_INTENT_SUCCESS,
  CREATE_PAYMENT_INTENT_FAIL,
  CONFIRM_CARD_PAYMENT_SUCCESS,
  CONFIRM_CARD_PAYMENT_FAIL,
  PAYMENT_PROCESSING,
  LOAD_CHECKOUT,
  FINISH_CHECKOUT,
} from "../actions/types";
import { PAYMENT_STATUS } from "../utils/constants";

const initialState = {
  isLoading: false,
  clientSecret: null,
  confirmedPaymentIntent: {},
  amount: null,
  status: localStorage.getItem("paymentStatus"),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PAYMENT_PROCESSING:
      return { ...state, isLoading: true };

    case LOAD_CHECKOUT:
      localStorage.setItem("paymentStatus", PAYMENT_STATUS.load_checkout);
      return {
        ...state,
        status: PAYMENT_STATUS.load_checkout,
      };

    case CREATE_PAYMENT_INTENT_SUCCESS:
      return {
        ...state,
        clientSecret: action.payload.clientSecret,
        amount: action.payload.amount,
        isLoading: false,
      };

    case CONFIRM_CARD_PAYMENT_SUCCESS:
      localStorage.setItem("paymentStatus", PAYMENT_STATUS.success);
      return {
        ...state,
        confirmedPaymentIntent: action.payload.paymentIntent,
        isLoading: false,
        status: PAYMENT_STATUS.success,
      };

    case FINISH_CHECKOUT:
      localStorage.setItem("paymentStatus", "");
      return {
        ...state,
        status: "",
      };

    case CREATE_PAYMENT_INTENT_FAIL:
    case CONFIRM_CARD_PAYMENT_FAIL:
      return { ...state, isLoading: false, confirmedPaymentIntent: null };
    default:
      return state;
  }
}
