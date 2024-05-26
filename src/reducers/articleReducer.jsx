import { GET_ARTICLES, SET_LOADING_STATUS, ADD_COMMENT } from "../actions/actionType";

const initialState = {
  articles: [],
  loading: false,
};

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
      };
    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.status,
      };
    case ADD_COMMENT:
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.articleId
            ? { ...article, comments: [...article.comments.filter(comment => comment.comment !== action.comment.comment), action.comment] }
            : article
        ),
      };
    default:
      return state;
  }
};


export default articleReducer;
