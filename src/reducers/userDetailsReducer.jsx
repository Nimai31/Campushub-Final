import { SET_USER_DETAILS } from "../actions/actionType";

const initialState = {
  headline: "",
  branch: "",
  semester: "",
  links: "",
};

const userDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default userDetailsReducer;
