// reducers/searchReducer.jsx
import { SET_SEARCH_QUERY } from "../actions/actionType";

const initialState = {
  searchQuery: "",
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query,
      };
    default:
      return state;
  }
};

export default searchReducer;
