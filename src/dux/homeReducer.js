// Action type constants
const LOAD_HOME_NOW = "LOAD_HOME_NOW"; // Imperative, hence "NOW"!
const FETCH_HOME_REQUEST = "FETCH_HOME_REQUEST";
const FETCH_HOME_SUCCESS = "FETCH_HOME_SUCCESS";
const FETCH_HOME_FAILURE = "FETCH_HOME_FAILURE";
const SAVE_EDITED_HOME = "SAVE_EDITED_HOME";
const SAVE_HOME_REQUEST = "SAVE_HOME_REQUEST";
const SAVE_HOME_SUCCESS = "SAVE_HOME_SUCCESS";
const SAVE_HOME_FAILED = "SAVE_HOME_FAILED";

export const actionTypes = {
  SAVE_EDITED_HOME
};

// Reducer
const homeReducer = (
  state = {
    fetchStatus: "",
    fetchError: "",
    saveHome: "",
    saveError: {},
    homeText: ""
  },
  action
) => {
  switch (action.type) {
    case FETCH_HOME_REQUEST:
      return { ...state, fetchStatus: "loading" };
    case FETCH_HOME_SUCCESS:
      return {
        ...state,
        fetchStatus: "",
        homeText: action.payload
      };
    case FETCH_HOME_FAILURE:
      return { ...state, fetchStatus: "failure", fetchError: action.payload };
    case SAVE_HOME_REQUEST:
      return {
        ...state,
        saveStatus: "saving"
      };
    case SAVE_HOME_SUCCESS:
      return {
        ...state,
        saveStatus: ""
      };
    case SAVE_HOME_FAILED:
      return { ...state, saveStatus: "failure", saveError: action.payload };

    default:
      return state;
  }
};

export const loadHomeNow = () => ({ type: LOAD_HOME_NOW });
// export const fetchHOMESucceeded = () => ({ type: FETCH_HOME_REQUEST });

const setFetchHomeRequest = () => ({
  type: FETCH_HOME_REQUEST
});
const setFetchHomeSucceeded = homeText => ({
  type: FETCH_HOME_SUCCESS,
  payload: homeText || ""
});
const setFetchHomeFailed = errorMessage => ({
  type: FETCH_HOME_FAILURE,
  payload: errorMessage
});

export const saveEditedHome = homeInfo => ({
  type: SAVE_EDITED_HOME,
  payload: homeInfo
});

export const saveHomeRequest = () => ({
  type: SAVE_HOME_REQUEST
});

export const saveHomeSucceeded = () => ({
  type: SAVE_HOME_SUCCESS
});

export const saveHomeFailed = error => ({
  type: SAVE_HOME_FAILED,
  payload: error
});

export const homeDuxActions = {
  setFetchHomeFailed,
  setFetchHomeRequest,
  setFetchHomeSucceeded
};





export default homeReducer;
