import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  userId: null,
  isAuthenticated: false,
  isLoading: false,
  user: JSON.parse(localStorage.getItem("user")),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return { ...state, isLoading: true };

    case USER_LOADED:
      const user = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        token: localStorage.getItem("token"),
        userId: user.id,
        isAuthenticated: true,
        isLoading: false,
        user: { name: user.name, email: user.email, id: user.id },
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.user.id,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        token: null,
        userId: null,
        isAuthenticated: false,
        isLoading: false,
        user: {},
      };

    default:
      return state;
  }
}
