import {
  ADD_EVENT,
  GET_EVENTS,
  DELETE_EVENT,
  UPDATE_EVENT,
  SET_LOADING_STATUS,
  ERROR,
} from "../actions/actionType";

const initialState = {
  events: [],
  error: null,
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };

    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.status,
      };
    case ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default eventReducer;
