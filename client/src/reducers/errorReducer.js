import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
  field: "",
  msg: "",
  status: null,
  id: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        field: (
          action.payload && 
          action.payload.error && 
          action.payload.error.field) 
          ? action.payload.error.field 
          : "",
        msg: action.payload.error.field
          ? action.payload.error.msg
          : action.payload.error,
        status: action.payload.status,
        id: action.payload.id,
      };
    case CLEAR_ERRORS:
      return {
        field: "",
        msg: "",
        status: null,
        id: null,
      };
    default:
      return state;
  }
}