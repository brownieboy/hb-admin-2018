// Action type constants
const LOAD_CONTACTUS_NOW = "LOAD_CONTACTUS_NOW"; // Imperative, hence "NOW"!
const FETCH_CONTACTUS_REQUEST = "FETCH_CONTACTUS_REQUEST";
const FETCH_CONTACTUS_SUCCESS = "FETCH_CONTACTUS_SUCCESS";
const FETCH_CONTACTUS_FAILURE = "FETCH_CONTACTUS_FAILURE";
const SAVE_EDITED_CONTACTUS = "SAVE_EDITED_CONTACTUS";
const SAVE_CONTACTUS_REQUEST = "SAVE_CONTACTUS_REQUEST";
const SAVE_CONTACTUS_SUCCESS = "SAVE_CONTACTUS_SUCCESS";
const SAVE_CONTACTUS_FAILED = "SAVE_CONTACTUS_FAILED";

export const actionTypes = {
  SAVE_EDITED_CONTACTUS
};

const defaultState = {
  fetchStatus: "",
  fetchError: "",
  saveError: {},
  contactUs: {
    startBlurb: "",
    email1: "",
    email2: "",
    mobile: "",
    gettingThereBlurb: "",
    locationBlurb: "",
    helstonburyWebUrl: "",
    helstonburyFBID: "",
    helstonburyMerchandiseFBID: "",
    helstonburyMerchandiseFBText: "",
    mapLinkText: "",
    venueAddress: "",
    venueEmail: "",
    venuePhone: "",
    appTips: ""
  }
};

// Reducer
const contactUsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CONTACTUS_REQUEST:
      return { ...state, fetchStatus: "loading" };
    case FETCH_CONTACTUS_SUCCESS:
      return {
        ...state,
        contactUs: action.payload, // will be an object
        fetchStatus: ""
      };
    case FETCH_CONTACTUS_FAILURE:
      return { ...state, fetchStatus: "failure", fetchError: action.payload };
    case SAVE_CONTACTUS_REQUEST:
      return {
        ...state,
        saveStatus: "saving"
      };
    case SAVE_CONTACTUS_SUCCESS:
      return {
        ...state,
        saveStatus: ""
      };
    case SAVE_CONTACTUS_FAILED:
      return { ...state, saveStatus: "failure", saveError: action.payload };

    default:
      return state;
  }
};

export const loadContactUsNow = () => ({ type: LOAD_CONTACTUS_NOW });
// export const fetchCONTACTUSSucceeded = () => ({ type: FETCH_CONTACTUS_REQUEST });

const setFetchContactUsRequest = () => ({
  type: FETCH_CONTACTUS_REQUEST
});
const setFetchContactUsSucceeded = constactUsText => ({
  type: FETCH_CONTACTUS_SUCCESS,
  payload: constactUsText || ""
});
const setFetchContactUsFailed = errorMessage => ({
  type: FETCH_CONTACTUS_FAILURE,
  payload: errorMessage
});

export const saveEditedContactUs = constactUsInfo => ({
  type: SAVE_EDITED_CONTACTUS,
  payload: constactUsInfo
});

export const saveContactUsRequest = () => ({
  type: SAVE_CONTACTUS_REQUEST
});

export const saveContactUsSucceeded = () => ({
  type: SAVE_CONTACTUS_SUCCESS
});

export const saveContactUsFailed = error => ({
  type: SAVE_CONTACTUS_FAILED,
  payload: error
});

export const contactUsDuxActions = {
  setFetchContactUsFailed,
  setFetchContactUsRequest,
  setFetchContactUsSucceeded
};

export default contactUsReducer;
