import {
  ADD_EVENT,
  GET_EVENTS,
  DELETE_EVENT,
  UPDATE_EVENT,
} from "../actions/actionType";

const initialState = {
  events: [],
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT:
      // Ensure no duplicate events are added
      if (state.events.find(event => event.id === action.event.id)) {
        return state;
      }
      return {
        ...state,
        events: [...state.events, action.event],
      };
    case GET_EVENTS:
      // Remove potential duplicates from the fetched events
      const uniqueEvents = action.events.filter(
        (event, index, self) => index === self.findIndex((e) => e.id === event.id)
      );
      return {
        ...state,
        events: uniqueEvents,
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
          event.id === action.eventId
            ? { ...event, ...action.eventData }
            : event
        ),
      };
    default:
      return state;
  }
};

export default eventReducer;