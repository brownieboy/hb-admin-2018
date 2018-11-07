// No longer used.  Use photoStorageReducer.js instead

// import { createSelector } from "reselect";

// Action type constants
const SEND_STORAGE_THUMB_START = "SEND_STORAGE_THUMB_START";
const SEND_STORAGE_THUMB_SUCCESS = "SEND_STORAGE_THUMB_SUCCESS";
const SEND_STORAGE_THUMB_FAILURE = "SEND_STORAGE_THUMB_FAILURE";
const UPDATE_STORAGE_THUMB_STATUS = "UPDATE_STORAGE_THUMB_STATUS";
const SEND_STORAGE_CARD_START = "SEND_STORAGE_CARD_START";
const SEND_STORAGE_CARD_SUCCESS = "SEND_STORAGE_CARD_SUCCESS";
const SEND_STORAGE_CARD_FAILURE = "SEND_STORAGE_CARD_FAILURE";
const UPDATE_STORAGE_CARD_STATUS = "UPDATE_STORAGE_CARD_STATUS";

export const actionTypes = {
  SEND_STORAGE_THUMB_START,
  SEND_STORAGE_THUMB_SUCCESS,
  SEND_STORAGE_THUMB_FAILURE,
  UPDATE_STORAGE_THUMB_STATUS,
  SEND_STORAGE_CARD_START,
  SEND_STORAGE_CARD_SUCCESS,
  SEND_STORAGE_CARD_FAILURE,
  UPDATE_STORAGE_CARD_STATUS
};

// Action creators
export const sendStorageThumbStart = fileInfo => ({
  type: SEND_STORAGE_THUMB_START,
  payload: fileInfo // e.g { postUrl: "" }
});

const sendStorageThumbSuccess = successInfo => ({
  type: SEND_STORAGE_THUMB_SUCCESS,
  payload: successInfo // e.g. {downloadUrl: ""}
});

const sendStorageThumbFailure = errorMessage => ({
  type: SEND_STORAGE_THUMB_FAILURE,
  payload: errorMessage
});

const updateStorageThumbStatus = statusInfo => ({
  type: UPDATE_STORAGE_THUMB_STATUS,
  payload: statusInfo // e.g. {percentUploaded: 15}
});

export const sendStorageCardStart = fileInfo => ({
  type: SEND_STORAGE_CARD_START,
  payload: fileInfo // e.g { postUrl: "" }
});

const sendStorageCardSuccess = successInfo => ({
  type: SEND_STORAGE_CARD_SUCCESS,
  payload: successInfo // e.g. {DownloadUrl: ""}
});

const sendStorageCardFailure = errorMessage => ({
  type: SEND_STORAGE_CARD_FAILURE,
  payload: errorMessage
});

const updateStorageCardStatus = statusInfo => ({
  type: UPDATE_STORAGE_CARD_STATUS,
  payload: statusInfo // e.g. {percentUploaded: 15}
});

export const storageDuxActions = {
  sendStorageThumbStart,
  sendStorageThumbSuccess,
  sendStorageThumbFailure,
  updateStorageThumbStatus,
  sendStorageCardStart,
  sendStorageCardSuccess,
  sendStorageCardFailure,
  updateStorageCardStatus
};

const initialState = {
  thumbStatus: "",
  thumbError: "",
  thumbFileInfo: "",
  thumbDownloadUrl: "",
  thumbProgress: 0,
  cardStatus: "",
  cardError: "",
  cardFileInfo: "",
  cardDownloadUrl: "",
  cardProgress: 0
};

// Reducer
const storageReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SEND_STORAGE_THUMB_START:
      return {
        ...state,
        thumbStatus: "posting",
        thumbFileInfo: payload.fileInfo
      };

    case SEND_STORAGE_THUMB_SUCCESS:
      return {
        ...state,
        thumbStatus: "success",
        thumbError: "",
        thumbDownloadUrl: action.downloadUrl
      };
    case SEND_STORAGE_THUMB_FAILURE:
      return { ...state, thumbStatus: "failure", fetchError: payload };
    case UPDATE_STORAGE_THUMB_STATUS:
      return {
        ...state,
        thumbStatus: "posting",
        thumbFileInfo: payload.fileInfo,
        thumbProgress: payload.percentUploaded
      };
    case SEND_STORAGE_CARD_START:
      return {
        ...state,
        cardStatus: "posting",
        cardFileInfo: payload.fileInfo
      };
    case SEND_STORAGE_CARD_SUCCESS:
      return {
        ...state,
        cardStatus: "success",
        cardError: "",
        cardDownloadUrl: action.downloadUrl
      };
    case SEND_STORAGE_CARD_FAILURE:
      return { ...state, cardStatus: "failure", fetchError: payload };
    case UPDATE_STORAGE_CARD_STATUS:
      return {
        ...state,
        cardStatus: "posting",
        cardFileInfo: payload.fileInfo,
        cardProgress: payload.percentUploaded
      };
    default:
      return state;
  }
};

export default storageReducer;
