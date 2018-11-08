import { put, select, takeEvery } from "redux-saga/effects";
import {
  actionTypes as bandsActionTypes,
  saveBandRequest,
  saveBandSucceeded,
  saveBandFailed
} from "../bandsReducer.js";

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
  yield put(saveBandRequest());
  const bandsList = yield select(state => state.bandsState.bandsList);

  const ref = yield firebaseApp.database().ref(globalTypes.DATABASE.BANDS_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  // console.log("Band saga saveData, saving..");
  yield ref.set(bandsList).catch(e => {
    firebaseError = e;
    console.log("Firebase band save error=" + e);
  });

  // console.log("Band saga saveData, done saving");

  if (firebaseError === "") {
    yield put(saveBandSucceeded());
    yield put(notifySuccess("Band saved to server okay"));
  } else {
    yield put(saveBandFailed(firebaseError));
    yield put(notifyError(`Error saving band: ${firebaseError}`));
  }
}

// const bandsConfigObj = {
//   path: globalTypes.DATABASE.BANDS_PATH,
//   requestAction: saveBandRequest,
//   successAction: saveBandSucceeded,
//   failAction: saveBandFailed
// };

const writeFirebaseSagas = [
  takeEvery(bandsActionTypes.SAVE_NEW_BAND, saveData),
  takeEvery(bandsActionTypes.SAVE_EDITED_BAND, saveData),
  takeEvery(bandsActionTypes.DELETE_BANDS, saveData),
  takeEvery(bandsActionTypes.ADJUST_BANDS_SAVE, saveData)
];

export default writeFirebaseSagas;
