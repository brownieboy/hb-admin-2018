import { put, select, takeEvery } from "redux-saga/effects";
import {
  actionTypes as appearancesActionTypes,
  saveAppearanceRequest,
  saveAppearanceSucceeded,
  saveAppearanceFailed
} from "../appearancesReducer.js";

import {
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo
} from "../react-redux-notify-helpers.js";

import firebaseApp from "../../apis/firebase-dev.js";

import { types as globalTypes } from "../../constants/firebasePaths.js";

function* saveData() {
  // Every saved edit, we write back to Firebase as an array.
  yield put(saveAppearanceRequest());
  const appearancesList = yield select(
    state => state.appearancesState.appearancesList
  );

  const ref = yield firebaseApp
    .database()
    .ref(globalTypes.DATABASE.APPEARANCES_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  yield ref.set(appearancesList).catch(e => {
    firebaseError = e;
    console.log("Firebase appearance save error=" + e);
  });

  if (firebaseError === "") {
    yield put(saveAppearanceSucceeded());
    yield put(notifySuccess("Schedule appearance saved to server okay"));
  } else {
    yield put(saveAppearanceFailed(firebaseError));
    yield put(notifyError(`Error saving appearance: ${firebaseError}`));
  }
}

// const appearancesConfigObj = {
//   path: globalTypes.DATABASE.APPEARANCES_PATH,
//   requestAction: saveAppearanceRequest,
//   successAction: saveAppearanceSucceeded,
//   failAction: saveAppearanceFailed
// };

function* adjustData() {
  // Nothing saved to firebase here.  It's just for the on-screen messages
  yield put(
    notifyInfo(
      "Times adjusted in UI only.  Use the 'Save schedule adjustments' button to save them to the server"
    )
  );
}

const writeFirebaseSagas = [
  takeEvery(appearancesActionTypes.SAVE_NEW_APPEARANCE, saveData),
  takeEvery(appearancesActionTypes.SAVE_EDITED_APPEARANCE, saveData),
  takeEvery(appearancesActionTypes.DELETE_APPEARANCES, saveData),
  takeEvery(appearancesActionTypes.ADJUST_APPEARANCES_SAVE, saveData),
  takeEvery(appearancesActionTypes.ADJUST_APPEARANCE_TIMES, adjustData)
];

export default writeFirebaseSagas;
