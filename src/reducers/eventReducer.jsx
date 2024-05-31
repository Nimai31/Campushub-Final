import { ADD_EVENT, GET_EVENTS, DELETE_EVENT, UPDATE_EVENT } from "../actions/actionType";

const initialState = {
  events: [],
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.event],
      };
    case GET_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.eventId),
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.eventId ? { ...event, ...action.eventData } : event
        ),
      };
    default:
      return state;
  }
};

export default eventReducer;
