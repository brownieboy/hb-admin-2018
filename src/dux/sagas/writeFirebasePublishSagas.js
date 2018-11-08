import { put, takeEvery } from "redux-saga/effects";
import {
  actionTypes as publishActionTypes,
  savePublishRequest,
  savePublishSucceeded
  // savePublishFailed
} from "../publishReducer.js";
import firebaseApp from "../../apis/firebase-dev.js";

import { types as globalTypes } from "../../constants/firebasePaths.js";

import {
  notifySuccess,
  notifyError
  // notifyWarning,
  // notifyInfo
} from "../react-redux-notify-helpers.js";

function* saveData(action) {
  // Every saved edit, we write back to Firebase as an array.
  yield put(savePublishRequest());
  // const PublishList = yield select(state => state.PublishState.PublishList);
  console.log("saveData saga handler for SAVE_PUBLISH_NOW, action:");
  console.log(action);

  const ref = yield firebaseApp
    .database()
    .ref(globalTypes.DATABASE.PUBLISHED_DATA_PATH);

  // The put statements didn't trigger Redux when I had them instead the .then()
  // and .catch() statements.  So I set a variable inside the .catch() then refer
  // to it in the if statement after the ref has run.  Clunky, but it works.

  let firebaseError = "";
  yield ref.set(action.payload).catch(e => {
    firebaseError = e;
    console.log("Firebase Publish save error=" + e);
  });

  if (firebaseError === "") {
    yield put(savePublishSucceeded());
    yield put(
      notifySuccess(
        "Data successfully pushed out.  Check your phone for updates!"
      )
    );
  } else {
    yield put(
      notifyError(
        `The was a server error when pushing data out to the phones: ${firebaseError}`
      )
    );
  }
}

const writeFirebaseSagas = [
  takeEvery(publishActionTypes.SAVE_PUBLISH_NOW, saveData)
];

export default writeFirebaseSagas;
