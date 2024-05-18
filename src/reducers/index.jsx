import { combineReducers } from "redux";
import articleReducer from "./articleReducer";
import userReducer from "./userReducer";
import userDetailsReducer from "./userDetailsReducer";

const rootReducer = combineReducers({
  articleState: articleReducer,
  userState: userReducer,
  userDetailsState: userDetailsReducer,
});

export default rootReducer;
