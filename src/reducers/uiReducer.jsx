const initialState = {
    showModal: "close",
  };
  
  const uiReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_SHOW_MODAL":
        return {
          ...state,
          showModal: action.status,
        };
      default:
        return state;
    }
  };
  
  export default uiReducer;
  