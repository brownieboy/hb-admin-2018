import { put, takeEvery } from "redux-saga/effects";
import {
  actionTypes as homeActionTypes,
  saveHomeRequest,
  saveHomeSucceeded,
  saveHomeFailed
} from "../homeReducer.js";

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
  yield put(saveHomeRequest());
  // const homeList = yield select(state => state.homeState.homeList);
  console.log(
    "saveData saga handler for SAVE_EDITED_HOME, action=" +
      JSON.stringify(action, null, 4)
  );

  const ref = yield firebaseApp
    .database()
    .ref(globalTypes.DATABASE.HOME_PAGE_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.
  let firebaseError = "";
  yield ref.set(action.payload).catch(e => {
    firebaseError = e;
    console.log("Firebase home save error=" + e);
  });

  if (firebaseError === "") {
    yield put(saveHomeSucceeded());
    yield put(notifySuccess("Home page data saved to server okay"));
  } else {
    yield put(notifyError(`Error saving home page: ${firebaseError}`));
  }
}

const writeFirebaseSagas = [
  takeEvery(homeActionTypes.SAVE_EDITED_HOME, saveData)
];

export default writeFirebaseSagas;
