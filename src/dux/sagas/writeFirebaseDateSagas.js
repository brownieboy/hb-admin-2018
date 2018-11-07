import { put, takeEvery } from "redux-saga/effects";
import {
  actionTypes as datesActionTypes,
  saveDatesRequest,
  saveDatesSucceeded,
  saveDatesFailed
} from "../datesReducer.js";

import {
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo
} from "../react-redux-notify-helpers.js";

import firebaseApp from "../../apis/firebase-dev.js";

import { types as globalTypes } from "../../constants/firebasePaths.js";

function* saveData(action) {
  // Every saved edit, we write back to Firebase as an array.
  yield put(saveDatesRequest());
  // const datesList = yield select(state => state.datesState.datesList);
  console.log(
    "saveData saga handler for SAVE_EDITED_DATES, action=" +
      JSON.stringify(action, null, 4)
  );

  const ref = yield firebaseApp.database().ref(globalTypes.DATABASE.DATES_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  yield ref.set(action.payload).catch(e => {
    firebaseError = e;
    console.log("Firebase dates save error=" + e);
  });

  if (firebaseError === "") {
    yield put(saveDatesSucceeded());
    yield put(notifySuccess("Dates saved to server okay"));
  } else {
    yield put(saveDatesFailed(firebaseError));
    yield put(notifyError(`Error saving dates: ${firebaseError}`));
  }
}

const writeFirebaseSagas = [
  takeEvery(datesActionTypes.SAVE_EDITED_DATES, saveData)
];

export default writeFirebaseSagas;
