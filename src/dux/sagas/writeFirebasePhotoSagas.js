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
  SAVE_NEW_PHOTO_AND_UPLOAD_PROCESS,
  // saveNewPhoto,
  appendNewPhoto,
  startFileUpload,
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

import { uploadImage } from "./uploadFirebaseImagesSagas.js";

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

// Here we're sequencing the sagas directly, rather than by posting the
// equivalent Redux actions.  That's because these have to happen in
// sequence.   See https://redux-saga.js.org/docs/advanced/SequencingSagas.html
function* savePhotoInfoAndUpload(data) {
  yield console.log("savePhotoInfoAndUpload saga, data:");
  yield console.log(data);
  yield put(appendNewPhoto(data.payload.photoInfo)); // Adds to store without saving
  yield* saveData(); // The saveData from *this* saga.
  yield* uploadImage({ payload: data.payload.storageInfo });

  /* this is what needs to get passed to starteFileUpload

payload:
assocEntityName: undefined
fileInfo: File(3100) {name: "acdc-logo.png", lastModified: 1543120779083, lastModifiedDate: Sun Nov 25 2018 15:39:39 GMT+1100 (Australian Eastern Daylight Time), webkitRelativePath: "", size: 3100, …}
id: "img-xe1mPAcYT"
photoType: "thumb"
storagePath: "/img/bands/thumbs"
type: "band"
__proto__: Object
type: "START_PHOTO_FILE_UPLOAD"

*/

  // Need to insert paths here?  We have data type etc.  Or is that
  // done in sagas we're about to call.
}
/*
function* saveAndOpenInUI(data) {
  console.log("saveAndOpenInUI data:");
  console.log(data);
  const { photoInfo, domUrl } = data.payload;
  yield put(saveNewPhoto(photoInfo));
  // yield console.log("Saved: now to open it!, domUrl:");
  // yield console.log(domUrl);
  // history.push(`/photoform/${photoInfo.id}`);
  yield window.open(domUrl, "_blank");
  // yield put(notifyInfo("When you've added and saved your photo, close this tab/window to return to band."));
}
*/

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
  // yield put(deleteStoragePhotos(deletePhotosAction.payload));
  const selectedInUseIDs = deletePhotosAction.payload.map(
    photoMember => photoMember.id
  );
  // 2. Delete references to the photo IDs on any band or stage docs

  yield put(clearThumbPhotosFromBands(selectedInUseIDs));
  yield put(clearCardPhotosFromBands(selectedInUseIDs));
  yield put(clearThumbPhotosFromStages(selectedInUseIDs));
  yield put(clearCardPhotosFromStages(selectedInUseIDs));

  // yield put(saveBandsToServer());
  // yield put(saveStagesToServer());

  // 3. Delete photo docs themselves, this triggers DELETE_PHOTOS, which
  // is watched in this saga and will trigger a data save.
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
  // takeEvery(photosActionTypes.DELETE_PHOTOS, saveData),
  takeEvery(photosActionTypes.START_DELETE_PHOTOS_PROCESS, deletePhotosProcess),
  takeEvery(SAVE_NEW_PHOTO_AND_UPLOAD_PROCESS, savePhotoInfoAndUpload)
  // takeEvery(SAVE_NEW_PHOTO_AND_OPEN_IN_UI, saveAndOpenInUI)
];

export default writeFirebaseSagas;
