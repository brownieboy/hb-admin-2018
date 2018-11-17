// IMPORTANT!  This saga is for uploading the meta data files, not the actual
// photo binaries themselves.  See uploadFirebaseImagesSagas.js for the latter.

import { put, select, takeEvery } from "redux-saga/effects";

// import { selectPhotos } from "../selectors/reselect-selectors.js";
import {
  clearCardPhotosFromBands,
  clearThumbPhotosFromBands,
  saveBandsToServer
} from "../bandsReducer.js";

import {
  clearCardPhotosFromStages,
  clearThumbPhotosFromStages,
  saveStagesToServer
} from "../stagesReducer.js";

import {
  actionTypes as photosActionTypes,
  deletePhotos,
  SAVE_NEW_PHOTO_AND_OPEN_IN_UI,
  saveNewPhoto,
  savePhotoRequest,
  savePhotoSucceeded,
  savePhotoFailed
} from "../photosReducer.js";

import { deleteStoragePhotos } from "../photosStorageReducer.js";

import {
  notifySuccess,
  notifyError
  // notifyWarning,
  // notifyInfo
} from "../react-redux-notify-helpers.js";

import firebaseApp from "../../apis/firebase-dev.js";

import { types as globalTypes } from "../../constants/firebasePaths.js";

function* saveData() {
  // Every saved edit, we write back to Firebase as an array.
  // console.log("writeFirebasePhotoSagas..saveData()");
  yield put(savePhotoRequest());
  const photosList = yield select(state => state.photosState.photosList);
  const ref = yield firebaseApp
    .database()
    .ref(globalTypes.DATABASE.PHOTOS_META_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  // console.log("Band saga saveData, saving..");
  yield ref.set(photosList).catch(e => {
    firebaseError = e;
    console.log("Firebase photo save error=" + e);
  });

  // console.log("Band saga saveData, done saving");

  if (firebaseError === "") {
    yield put(savePhotoSucceeded());
    yield put(notifySuccess("Photo meta saved to server okay"));
  } else {
    yield put(savePhotoFailed(firebaseError));
    yield put(notifyError(`Photo meta saving: ${firebaseError}`));
  }
}

function* saveAndOpenInUI(data) {
  console.log("saveAndOpenInUI data:");
  console.log(data);
  const { photoInfo, history } = data.payload;
  yield put(saveNewPhoto(photoInfo));
  yield console.log("Saved: now to open it!, history:");
  yield console.log(history);
  // history.push(`/photoform/${photoInfo.id}`);
  window.open(`/#/photoform/${photoInfo.id}`, "_blank");
}

function* deletePhotosProcess(deletePhotosAction) {
  // This generator function uses the
  // deletePhotosAction.payload is an array of photo objects
  yield console.log(
    "deletePhotosProcess saga has listened, deletePhotosArray:"
  );
  console.log(deletePhotosAction);
  // Syntax for calling a selector from a saga, taken from
  // https://github.com/reduxjs/reselect/issues/304
  // sagas (where you can call yield select(selector)

  // const photoObjectsArray = yield select(selectPhotos);
  // const selectedPhotoObjectsArray = photoObjectsArray.filter(photoMember =>
  //   deletePhotosAction.payload.includes(photoMember.id)
  // );
  // yield put(
  //   deleteStoragePhotos(selectedPhotoObjectsArray)
  // );

  // 1. Delete the actual photos from Firebase storage
  yield put(deleteStoragePhotos(deletePhotosAction.payload));
  const selectedInUseIDs = deletePhotosAction.payload.map(
    photoMember => photoMember.id
  );
  // 2. Delete references to the photo IDs on any band or stage docs

  yield put(clearThumbPhotosFromBands(selectedInUseIDs));
  yield put(clearCardPhotosFromBands(selectedInUseIDs));
  yield put(clearThumbPhotosFromStages(selectedInUseIDs));
  yield put(clearCardPhotosFromStages(selectedInUseIDs));

  yield put(saveBandsToServer());
  yield put(saveStagesToServer());

  // 3. Delete photo docs themselves
  yield put(deletePhotos(selectedInUseIDs));

  /*
  const selectedBandsThumbsInUseIds = deletePhotosAction.payload
    .filter(
      photoMember =>
        photoMember.type === "band" && photoMember.photoType === "thumb"
    )
    .map(photoMember => photoMember.id);

  const selectedBandsCardsInUseIds = deletePhotosAction.payload
    .filter(
      photoMember =>
        photoMember.type === "band" && photoMember.photoType === "card"
    )
    .map(photoMember => photoMember.id);

  const selectedStagesThumbsInUseIds = deletePhotosAction.payload
    .filter(
      photoMember =>
        photoMember.type === "stage" && photoMember.photoType === "thumb"
    )
    .map(photoMember => photoMember.id);

  const selectedStagesCardsInUseIds = deletePhotosAction.payload
    .filter(
      photoMember =>
        photoMember.type === "stage" && photoMember.photoType === "card"
    )
    .map(photoMember => photoMember.id);

  yield put(clearThumbPhotosFromBands(selectedBandsThumbsInUseIds));
  yield put(clearCardPhotosFromBands(selectedBandsCardsInUseIds));
  yield put(clearThumbPhotosFromStages(selectedStagesThumbsInUseIds));
  yield put(clearCardPhotosFromStages(selectedStagesCardsInUseIds));
*/

  // Need to trigger the various saves to Firebasehere.
}

const writeFirebaseSagas = [
  takeEvery(photosActionTypes.SAVE_NEW_PHOTO, saveData),
  takeEvery(photosActionTypes.SAVE_EDITED_PHOTO, saveData),
  takeEvery(photosActionTypes.DELETE_PHOTOS, saveData),
  takeEvery(photosActionTypes.START_DELETE_PHOTOS_PROCESS, deletePhotosProcess),
  takeEvery(SAVE_NEW_PHOTO_AND_OPEN_IN_UI, saveAndOpenInUI)
];

export default writeFirebaseSagas;
