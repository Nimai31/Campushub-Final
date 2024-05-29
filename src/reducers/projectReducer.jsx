import { ADD_PROJECT, GET_PROJECTS, ADD_PROJECT_MEMBER, DELETE_PROJECT, UPDATE_PROJECT } from "../actions/actionType";

const initialState = {
  projects: [],
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.project],
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.projects,
      };
    case ADD_PROJECT_MEMBER:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.projectId
            ? {
                ...project,
                roles: project.roles.map((role, index) =>
                  index === action.roleIndex ? { ...role, name: action.memberName } : role
                ),
              }
            : project
        ),
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.projectId),
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.projectId ? { ...project, ...action.projectData } : project
        ),
      };
    default:
      return state;
  }
};

export default projectReducer;