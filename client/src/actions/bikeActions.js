import axios from "axios";
import { returnErrors } from "./errorActions";
import { ROOT_ENDPOINT } from "../utils/constants";
import {
  ADD_BIKE,
  GET_BIKES,
  DELETE_BIKE,
  BIKES_LOADING,
  GET_BIKES_FAIL,
  ADD_BIKE_FAIL,
  DELETE_BIKE_FAIL,
  GET_BIKE_INFO,
  GET_BIKE_INFO_FAIL,
} from "./types";

export const getBikes = (paramsObject) => async (dispatch) => {
  dispatch(setBikesLoading());
  try {
    const endpoint = `${ROOT_ENDPOINT}/api/bikes`;
    const res = await axios.get(endpoint,{
      params: paramsObject
    });
    return dispatch({
      type: GET_BIKES,
      payload: res.data.data,
    });
  } catch (err) {
    if (err.response)
      dispatch(returnErrors(err.response.error, err.response.status));
    dispatch({ type: GET_BIKES_FAIL });
  }
};

export const getBikeInfo = (id) => async (dispatch) => {
  try {
    const endpoint = `${ROOT_ENDPOINT}/api/bikes/${id}`;
    const res = await axios.get(endpoint);
    return dispatch({
      type: GET_BIKE_INFO,
      payload: res.data.data[0],
    });
  } catch (err) {
    if (err.response)
      dispatch(returnErrors(err.response.error, err.response.status));
    dispatch({ type: GET_BIKE_INFO_FAIL });
  }
};

export const addBike = (bike) => async (dispatch) => {
  try {
    const endpoint = `${ROOT_ENDPOINT}/api/bikes`;
    const res = await axios.post(endpoint, bike);
    return dispatch({
      type: ADD_BIKE,
      payload: res.data,
    });
  } catch (err) {
    if (err.response)
      dispatch(returnErrors(err.response.error, err.response.status));
    dispatch({ type: ADD_BIKE_FAIL });
  }
};

export const deleteBike = (id) => async (dispatch) => {
  try {
    const endpoint = `${ROOT_ENDPOINT}/api/bikes/${id}`;
    await axios.delete(endpoint);
    return dispatch({
      type: DELETE_BIKE,
      payload: id,
    });
  } catch (err) {
    if (err.response)
      dispatch(returnErrors(err.response.error, err.response.status));
    dispatch({ type: DELETE_BIKE_FAIL });
  }
};

export const setBikesLoading = () => {
  return {
    type: BIKES_LOADING,
  };
};
