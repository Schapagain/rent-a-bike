import axios from "axios";
import { returnErrors } from "./errorActions";
import { ROOT_ENDPOINT } from "../utils/constants";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from "./types";
import { tokenConfig } from "./shared";

export const loadUser = () => async (dispatch, getState) => {
  // trigger USER_LOADING
  dispatch({ type: USER_LOADING });
  try {
    const token = getState().auth.token;
    if (!token) {
      dispatch({ type: AUTH_ERROR });
    } else {
      const endpoint = `${ROOT_ENDPOINT}/api/users`;
      const res = await axios.get(endpoint, tokenConfig(getState));
      dispatch({ type: USER_LOADED, payload: res.data.data[0] });
    }
  } catch (err) {
    if (err && err.response) {
      dispatch(returnErrors(err.response.data.error, err.response.status));
    }
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const signUp = (newUser) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  // set content-type header
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };

  //Request body
  // File objects can't be stringified,
  //  so we submit the body as FormData instead of JSON
  const body = newUser;
  const endpoint = `${ROOT_ENDPOINT}/api/users/signup`;
  try {
    await axios.post(endpoint, body, config);
    dispatch({ type: REGISTER_SUCCESS });
    dispatch(returnErrors("Signed up successfully!", null, REGISTER_SUCCESS));
  } catch (err) {
    if (err) {
      dispatch(
        returnErrors(
          err.response.data.error,
          err.response.status,
          "REGISTER_FAIL"
        )
      );
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

// log in
export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  // set content-type header
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const endpoint = `${ROOT_ENDPOINT}/api/auth`;
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(endpoint, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      dispatch(
        returnErrors(err.response.data.error, err.response.status, LOGIN_FAIL)
      );
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

// logout
export const logOut = () => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};
