import { SET_USER_DETAILS, SET_CERTIFICATES } from "../actions/actionType";

const initialState = {
  headline: "",
  branch: "",
  semester: "",
  links: "",
  certificates: [],
};

const userDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        ...action.payload,
      };
    case SET_CERTIFICATES:
      return {
        ...state,
        certificates: action.certificates,
      };
    default:
      return state;
  }
};

export default userDetailsReducer;