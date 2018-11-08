import { put, takeEvery } from "redux-saga/effects";
import {
  actionTypes as contactUsActionTypes,
  saveContactUsRequest,
  saveContactUsSucceeded,
  saveContactUsFailed
} from "../contactUsReducer.js";

import {
  notifySuccess,
  notifyError
  // notifyWarning,
  // notifyInfo
} from "../react-redux-notify-helpers.js";

import firebaseApp from "../../apis/firebase-dev.js";

import { types as globalTypes } from "../../constants/firebasePaths.js";

function* saveData(action) {
  // Every saved edit, we write back to Firebase as an array.
  yield put(saveContactUsRequest());
  // const contactUsList = yield select(state => state.contactUsState.contactUsList);
  console.log(
    "saveData saga handler for SAVE_EDITED_CONTACTUS, action=" +
      JSON.stringify(action, null, 4)
  );

  const ref = yield firebaseApp
    .database()
    .ref(globalTypes.DATABASE.CONTACTUS_PAGE_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  yield ref.set(action.payload).catch(e => {
    firebaseError = e;
    console.log("Firebase contactUs save error=" + e);
  });

  if (firebaseError === "") {
    yield put(saveContactUsSucceeded());
    yield put(notifySuccess("Contact info saved to server okay"));
  } else {
    yield put(saveContactUsFailed(firebaseError));
    yield put(notifyError(`Error saving contact info: ${firebaseError}`));
  }
}

const writeFirebaseSagas = [
  takeEvery(contactUsActionTypes.SAVE_EDITED_CONTACTUS, saveData)
];

export default writeFirebaseSagas;
