// import { createSelector } from "reselect";
// import createCachedSelector from "re-reselect";

// import {
//   stringSort,
//   stringSortIgnoreArticle
// } from "../helper-functions/sorting.js";
// import { selectBands } from "./bandsReducer.js";
// import { selectStages } from "./stagesReducer.js";

// Action type constants

const FETCH_PHOTOS_REQUEST = "FETCH_PHOTOS_REQUEST";
const FETCH_PHOTOS_SUCCESS = "FETCH_PHOTOS_SUCCESS";
const FETCH_PHOTOS_FAILURE = "FETCH_PHOTOS_FAILURE";
const SAVE_PHOTO_REQUEST = "SAVE_PHOTO_REQUEST";
const SAVE_PHOTO_SUCCESS = "SAVE_PHOTO_SUCCESS";
const SAVE_PHOTO_FAILED = "SAVE_PHOTO_FAILED";
const SAVE_NEW_PHOTO = "SAVE_NEW_PHOTO";
export const APPEND_NEW_PHOTO = "APPEND_NEW_PHOTO";
const SAVE_EDITED_PHOTO = "SAVE_EDITED_PHOTO";
export const START_PHOTO_FILE_UPLOAD = "START_PHOTO_FILE_UPLOAD";
export const UPDATE_PHOTO_FILE_URL = "UPDATE_PHOTO_FILE_URL";
const START_DELETE_PHOTOS_PROCESS = "START_DELETE_PHOTOS_PROCESS";
const DELETE_PHOTOS = "DELETE_PHOTOS";
// export const SAVE_NEW_PHOTO_AND_OPEN_IN_UI = "SAVE_NEW_PHOTO_AND_OPEN_IN_UI";
export const SAVE_NEW_PHOTO_AND_UPLOAD_PROCESS =
  "SAVE_NEW_PHOTO_AND_UPLOAD_PROCESS";

export const actionTypes = {
  SAVE_NEW_PHOTO,
  SAVE_EDITED_PHOTO,
  DELETE_PHOTOS,
  START_DELETE_PHOTOS_PROCESS
};

const defaultState = {
  fetchStatus: "",
  fetchError: "",
  fileInfo: "",
  photosList: []
};

// Reducer
const photosReducer = (state = defaultState, action) => {
  let idx, currentPhotoObj, newPhotosList;
  switch (action.type) {
    case FETCH_PHOTOS_REQUEST:
      return { ...state, fetchStatus: "loading" };
    case FETCH_PHOTOS_SUCCESS:
      // console.log("reducer FETCH_PHOTOS_SUCCESS");
      return {
        ...state,
        fetchStatus: "",
        photosList: action.payload
      };
    case FETCH_PHOTOS_FAILURE:
      return { ...state, fetchStatus: "failure", fetchError: action.payload };
    case APPEND_NEW_PHOTO:
    case SAVE_NEW_PHOTO: // deliberate fall through
      // case SAVE_NEW_PHOTO_AND_OPEN_IN_UI:
      return {
        ...state,
        photosList: [...state.photosList, action.payload.photoInfo]
      };
    case SAVE_EDITED_PHOTO:
      // console.log("SAVED_EDITED_PHOTO reducer");
      idx = state.photosList.findIndex(
        photoObj => photoObj.id === action.payload.id
      );
      if (idx >= 0) {
        currentPhotoObj = state.photosList.slice()[idx];
        // Only these 3 fields can ever change in an edited photo doc.
        newPhotosList = [
          ...state.photosList.slice(0, idx),
          {
            ...currentPhotoObj,
            fileName: action.payload.fileName,
            photoType: action.payload.photoType,
            fullUrl: action.payload.fullUrl,
            caption: action.payload.caption
          },
          ...state.photosList.slice(idx + 1)
        ];
        return { ...state, photosList: newPhotosList };
      }
      return state;
    case SAVE_PHOTO_REQUEST:
      return {
        ...state,
        saveStatus: "saving"
      };
    case SAVE_PHOTO_SUCCESS:
      return {
        ...state,
        saveStatus: "success"
      };
    case START_PHOTO_FILE_UPLOAD:
      return {
        ...state,
        fileInfo: action.payload.fileInfo
      };
    case UPDATE_PHOTO_FILE_URL:
      // console.log("UPDATE_PHOTO_THUMB_URL reducer, action: ");
      // console.log(action);
      // debugger;
      idx = state.photosList.findIndex(
        photoObj => photoObj.id === action.payload.id
      );

      newPhotosList = [
        ...state.photosList.slice(0, idx),
        {
          ...state.photosList[idx],
          fullUrl: action.payload.downloadUrl,
          filePath: action.payload.filePath
        },
        ...state.photosList.slice(idx + 1)
      ];
      return { ...state, photosList: newPhotosList };

    case DELETE_PHOTOS:
      newPhotosList = state.photosList.filter(
        photoMember => !action.payload.includes(photoMember.id)
      );
      return { ...state, photosList: newPhotosList };

    case START_DELETE_PHOTOS_PROCESS:
    // Fall through to returning state.  This action is only here to be
    // listened to by the saga.  DELETE_PHOTOS, above, does actual deletion.

    // eslint-disable-next-line no-fallthrough
    default:
      return state;
  }
};

// Selectors
// const getAllPhotos = state => state.photosState.photosList;

// Getters don't use redux-select, so are bad, but flexible
export const getPhotoInfoForId = (state, photoId) =>
  state.photosState.photosList
    ? state.photosState.photosList.find(
        photoMember => photoMember.id === photoId
      )
    : null;

export const getPhotoInfoFromListForId = (photosList, photoId) =>
  photosList
    ? photosList.find(photoMember => photoMember.id === photoId)
    : null;

// Action Creators
const setFetchPhotosRequest = () => ({
  type: FETCH_PHOTOS_REQUEST
});
const setFetchPhotosSucceeded = photosList => ({
  type: FETCH_PHOTOS_SUCCESS,
  payload: photosList || []
});
const setFetchPhotosFailed = errorMessage => ({
  type: FETCH_PHOTOS_FAILURE,
  payload: errorMessage
});
export const startFileUpload = fileInfo => ({
  type: START_PHOTO_FILE_UPLOAD,
  payload: fileInfo
});
export const saveNewPhoto = photoInfo => ({
  type: SAVE_NEW_PHOTO,
  payload: { photoInfo }
});
export const appendNewPhoto = photoInfo => ({
  type: APPEND_NEW_PHOTO,
  payload: { photoInfo }
});
export const saveEditedPhoto = photoInfo => ({
  type: SAVE_EDITED_PHOTO,
  payload: photoInfo
});
export const updatePhotoFileUrl = updateInfo => ({
  type: UPDATE_PHOTO_FILE_URL,
  payload: updateInfo
});

export const savePhotoRequest = () => ({
  type: SAVE_PHOTO_REQUEST
});

export const savePhotoSucceeded = () => ({
  type: SAVE_PHOTO_SUCCESS
});

export const savePhotoFailed = error => ({
  type: SAVE_PHOTO_FAILED,
  payload: error
});

// Action that is listened to by the sagas.
export const startDeletePhotosProcess = deletePhotoProcessObj => ({
  type: START_DELETE_PHOTOS_PROCESS,
  payload: deletePhotoProcessObj
});

// Action deletion of photos from this list
export const deletePhotos = photoIdsArray => ({
  type: DELETE_PHOTOS,
  payload: photoIdsArray
});

// Action that is listened to by the sagas.
export const saveNewPhotoAndUploadProcess = (
  photoInfo,
  storageInfo,
  notifyInfo = {}
) => ({
  type: SAVE_NEW_PHOTO_AND_UPLOAD_PROCESS,
  payload: {
    photoInfo,
    storageInfo,
    notifyInfo
  }
});

// export const saveNewPhotoAndOpenInNewUI = (photoInfo, domUrl) => ({
//   type: SAVE_NEW_PHOTO_AND_OPEN_IN_UI,
//   payload: {
//     photoInfo,
//     domUrl
//   }
// });

export const photosDuxActions = {
  setFetchPhotosRequest,
  setFetchPhotosSucceeded,
  setFetchPhotosFailed
};

export default photosReducer;
