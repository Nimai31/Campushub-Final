import {
    POST_PROJECT,
    UPDATE_PROJECT,
    GET_PROJECTS,
  } from "../actions/actionType";
  
  const initialState = {
    projects: [],
    currentProject: null,
  };
  
  const projectReducer = (state = initialState, action) => {
    switch (action.type) {
      case POST_PROJECT:
        return {
          ...state,
          projects: [...state.projects, action.payload],
        };
      case UPDATE_PROJECT:
        return {
          ...state,
          projects: state.projects.map((project) =>
            project.id === action.id ? { ...project, ...action.payload } : project
          ),
        };
      case GET_PROJECTS:
        return {
          ...state,
          projects: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default projectReducer;
  