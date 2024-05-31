import { combineReducers } from "redux";
import articleReducer from "./articleReducer";
import userReducer from "./userReducer";
import userDetailsReducer from "./userDetailsReducer";
import projectReducer from "./projectReducer";
import eventReducer from "./eventReducer";

const rootReducer = combineReducers({
  articleState: articleReducer,
  userState: userReducer,
  userDetailsState: userDetailsReducer,
  projectState: projectReducer,
  eventState: eventReducer,
});

export default rootReducer;