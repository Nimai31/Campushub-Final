import { SET_USER, SET_USER_DETAILS } from "../actions/actionType";

const INITIAL_STATE = {
  user: null,
  userDetails: {},
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
