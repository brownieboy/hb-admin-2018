const SAVE_PUBLISH_REQUEST = "SAVE_PUBLISH_REQUEST";
const SAVE_PUBLISH_SUCCESS = "SAVE_PUBLISH_SUCCESS";
const SAVE_PUBLISH_FAILED = "SAVE_PUBLISH_FAILED";
const SAVE_PUBLISH_NOW = "SAVE_PUBLISH_NOW";

export const actionTypes = {
  SAVE_PUBLISH_NOW,
  SAVE_PUBLISH_SUCCESS,
  SAVE_PUBLISH_FAILED,
  SAVE_PUBLISH_REQUEST
};

// Published data getters
// const getPublishedData = () => {
//   return { published: "here it is" };
// };


export const savePublishRequest = () => ({
  type: SAVE_PUBLISH_REQUEST
});

export const savePublishSucceeded = () => ({
  type: SAVE_PUBLISH_SUCCESS
});

export const savePublishNow = publishData => ({
  type: SAVE_PUBLISH_NOW,
  payload: publishData
});

export const savePublishFailed = error => ({
  type: SAVE_PUBLISH_FAILED,
  payload: error
});

// Reducer
const publishReducer = (
  state = {
    saveStatus: "",
    publishedData: {}
  },
  action
) => {
  switch (action.type) {
    case SAVE_PUBLISH_NOW:
      // Listened out for in writeFirebasePublishSagas.js
      return {
        ...state,
        publishedData: action.payload
      };

    case SAVE_PUBLISH_REQUEST:
      return {
        ...state,
        saveStatus: "loading"
      };
    case SAVE_PUBLISH_SUCCESS:
      return {
        ...state,
        saveStatus: ""
      };
    case SAVE_PUBLISH_FAILED:
      return { ...state, saveStatus: "failure", saveError: action.payload };

    default:
      return state;
  }
};

export default publishReducer;
