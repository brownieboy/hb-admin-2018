// import { createSelector } from "reselect";

// Action type constants
const SEND_PHOTO_STORAGE_START = "SEND_PHOTO_STORAGE_START";
const SEND_PHOTO_STORAGE_SUCCESS = "SEND_PHOTO_STORAGE_SUCCESS";
const SEND_PHOTO_STORAGE_FAILURE = "SEND_PHOTO_STORAGE_FAILURE";
const UPDATE_PHOTO_STORAGE_STATUS = "UPDATE_PHOTO_STORAGE_STATUS";
export const DELETE_STORAGE_PHOTOS = "DELETE_STORAGE_PHOTOS";

export const actionTypes = {
  SEND_PHOTO_STORAGE_START,
  SEND_PHOTO_STORAGE_SUCCESS,
  SEND_PHOTO_STORAGE_FAILURE,
  UPDATE_PHOTO_STORAGE_STATUS
};

// This is the type of object held in the array
const initialIndividualPhotoState = {
  updateId: "",
  photoStatus: "",
  photoError: "",
  photoFileInfo: "",
  photoDownloadUrl: "",
  photoProgress: 0
};

// Reducer
// Initial state is an array, so we can track multiple photo
// uploads simultaneusly, tracking them by their IDs.
const photoStorageReducer = (
  state = { uploadingPhotosList: [], deletingPhotosList: [] },
  action
) => {
  const { type, payload } = action;
  let matchingPhotoIndex, newPhotoObj;
  switch (type) {
    case SEND_PHOTO_STORAGE_START:
      // Push a new photo update object onto the array
      // Note.  Need to check if there's on already.
      // console.log("photosStorageReducer.js, SEND_PHOTO_STORAGE_START");

      newPhotoObj = {
        ...initialIndividualPhotoState,
        updateId: payload.updateId,
        photoStatus: "posting",
        photoFileInfo: payload.fileInfo,
        photoProgress: 0
      };

      matchingPhotoIndex = state.uploadingPhotosList.findIndex(
        memberObj => memberObj.updateId === payload.updateId
      );
      // If the "new" on is actually already in the array then
      // we replace it...
      if (matchingPhotoIndex >= 0) {
        return {
          ...state,
          uploadingPhotosList: [
            ...state.uploadingPhotosList.slice(0, matchingPhotoIndex),
            newPhotoObj,
            ...state.uploadingPhotosList.slice(matchingPhotoIndex + 1)
          ]
        };
      }
      // ...otherwise we just append it to the array
      return {
        ...state,
        uploadingPhotosList: [...state.uploadingPhotosList, newPhotoObj]
      };

    case UPDATE_PHOTO_STORAGE_STATUS:
      matchingPhotoIndex = state.uploadingPhotosList.findIndex(
        memberObj => memberObj.updateId === payload.updateId
      );

      if (matchingPhotoIndex >= 0) {
        return {
          ...state,
          uploadingPhotosList: [
            ...state.uploadingPhotosList.slice(0, matchingPhotoIndex),
            {
              updateId: payload.updateId,
              photoStatus: "posting",
              photoProgress: payload.statusInfo.percentUploaded
            },
            ...state.uploadingPhotosList.slice(matchingPhotoIndex + 1)
          ]
        };
      }
      return state;

    case SEND_PHOTO_STORAGE_SUCCESS:
      matchingPhotoIndex = state.uploadingPhotosList.findIndex(
        memberObj => memberObj.updateId === payload.updateId
      );

      if (matchingPhotoIndex >= 0) {
        return {
          ...state,
          uploadingPhotosList: [
            ...state.uploadingPhotosList.slice(0, matchingPhotoIndex),
            {
              updateId: payload.updateId,
              photoStatus: "success",
              photoProgress: 100
            },
            ...state.uploadingPhotosList.slice(matchingPhotoIndex + 1)
          ]
        };
      }
      return state;

    // case SEND_PHOTO_STORAGE_FAILURE:
    //   overridePhotoDataObj = {
    //     photoStatus: "failure",
    //     fetchError: payload
    //   };

    //   return {
    //     ...state,
    //     uploadingPhotosList: [
    //       // ...state.uploadingPhotosList,
    //       ...getNewuploadingPhotosListForId(
    //         payload.updateId,
    //         state.uploadingPhotosList,
    //         overridePhotoDataObj
    //       )
    //     ]
    //   };

    default:
      return state;
  }
};

// Getters are just functions, so keep it simple here to avoid unnecessary renders
export const getUploadingPhotosList = state =>
  state.photosStorageState.uploadingPhotosList;

export const getUploadingPhotoStorageInfoForId = (state, photoId) =>
  state.photosStorageState.uploadingPhotosList
    ? state.photosStorageState.uploadingPhotosList.find(
        photoStorageMember => photoStorageMember.updateId === photoId
      )
    : null;

export const getUploadingPhotoProgressForId = (state, photoId) => {
  const photoStorageMember = getUploadingPhotoStorageInfoForId(state, photoId);
  if (photoStorageMember && photoStorageMember.photoProgress) {
    return photoStorageMember.photoProgress;
  }
  return 0;
};

// Action creators
export const sendPhotoStorageStart = (updateId, fileInfo) => ({
  type: SEND_PHOTO_STORAGE_START,
  payload: {
    updateId, // updateId of the photo being updated
    fileInfo // object, e.g { postUrl: "" } }
  }
});
export const updatePhotoStorageStatus = (updateId, statusInfo) => ({
  type: UPDATE_PHOTO_STORAGE_STATUS,
  payload: {
    updateId,
    statusInfo // e.g. {percentUploaded: 15}
  }
});
export const sendPhotoStorageSuccess = (updateId, successInfo) => ({
  type: SEND_PHOTO_STORAGE_SUCCESS,
  payload: {
    updateId,
    successInfo // e.g. {downloadUrl: ""}
  }
});
export const sendPhotoStorageFailure = (updateId, errorMessage) => ({
  type: SEND_PHOTO_STORAGE_FAILURE,
  payload: { updateId, errorMessage }
});

// Action that is listened to by the writeFirebasePhotoSagas.
export const deleteStoragePhotos = photoIdsArray => ({
  type: DELETE_STORAGE_PHOTOS,
  payload: photoIdsArray
});

export default photoStorageReducer;
