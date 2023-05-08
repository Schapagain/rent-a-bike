import {
  ADD_BIKE,
  DELETE_BIKE,
  GET_BIKES,
  BIKES_LOADING,
  GET_BIKES_FAIL,
  ADD_BIKE_FAIL,
  DELETE_BIKE_FAIL,
  GET_BIKE_INFO,
  GET_BIKE_INFO_FAIL,
} from "../actions/types";

const initialState = {
  bikes: [],
  isLoading: false,
  selectedBike: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BIKE:
      return {
        ...state,
        bikes: [action.payload, ...state.bikes],
      };
    case GET_BIKES:
      return {
        ...state,
        bikes: action.payload,
        isLoading: false,
      };
    case GET_BIKE_INFO:
      return {
        ...state,
        selectedBike: action.payload,
        isLoading: false,
      };
    case DELETE_BIKE:
      return {
        ...state,
        bikes: state.bikes.filter((bike) => bike.id !== action.payload),
      };
    case BIKES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_BIKES_FAIL:
    case GET_BIKE_INFO_FAIL:
    case ADD_BIKE_FAIL:
    case DELETE_BIKE_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
