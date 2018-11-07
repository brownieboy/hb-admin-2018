// import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// import { AsyncStorage } from "react-native";
import { buffers, eventChannel } from "redux-saga";
import { fork, put, take } from "redux-saga/effects";
// import FastImage from "react-native-fast-image";
import firebaseApp from "../../apis/firebase-dev.js";
import { types as globalTypes } from "../../constants/firebasePaths.js";

// import bandsApi from "../api/bandsApi.js";
import {
  bandsDuxActions
  // bandsDuxConstants,
} from "../bandsReducer.js";
import {
  appearancesDuxActions
  // appearancesDuxConstants
} from "../appearancesReducer.js";
import { homeDuxActions } from "../homeReducer.js";
import { stagesDuxActions } from "../stagesReducer.js";
import { datesDuxActions } from "../datesReducer.js";
import { contactUsDuxActions } from "../contactUsReducer.js";
import { photosDuxActions } from "../photosReducer.js";

export function createEventChannel(ref) {
  const listener = eventChannel(emit => {
    ref.on("value", snap => {
      emit({
        key: snap.key,
        value: snap.val()
      });
    });
    return () => {
      ref.off();
    };
  }, buffers.expanding(1));
  return listener;
}

function* readDatesSaga() {
  // console.log("running updatedItemSaga...");
  yield put(datesDuxActions.setFetchDatesRequest());
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.DATES_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readDatesSaga=" + JSON.stringify(item, null, 4).substring(0, 500)
    // );
    yield put(datesDuxActions.setFetchDatesSucceeded(item.value));
  }
}

function* readHomeSaga() {
  // console.log("running readHomeSaga...");
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.HOME_PAGE_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readHomeSaga=" + JSON.stringify(item, null, 4).substring(0, 500)
    // );
    yield put(homeDuxActions.setFetchHomeSucceeded(item.value.homeText));
  }
}

function* readContactUsSaga() {
  // console.log("running readContactUsSaga...");
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.CONTACTUS_PAGE_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readContactUsSaga=" + JSON.stringify(item, null, 4).substring(0, 500)
    // );
    yield put(contactUsDuxActions.setFetchContactUsSucceeded(item.value));
  }
}

function* readBandsSaga() {
  // console.log("running updatedItemSaga...");
  yield put(bandsDuxActions.setFetchBandsRequest());
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.BANDS_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readBandsSaga=" + JSON.stringify(item, null, 2).substring(0, 300)
    // );
    yield put(bandsDuxActions.setFetchBandsSucceeded(item.value));
  }
}

function* readPhotosMetaSaga() {
  // console.log("running readPhotosMetaSaga...");
  yield put(photosDuxActions.setFetchPhotosRequest());
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.PHOTOS_META_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readPhotosMetaSaga=" + JSON.stringify(item, null, 2).substring(0, 500)
    // );
    yield put(photosDuxActions.setFetchPhotosSucceeded(item.value));
  }
}

function* readAppearancesSaga() {
  // console.log("running updatedItemSaga...");
  yield put(appearancesDuxActions.setFetchAppearancesRequest());
  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.APPEARANCES_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // yield console.log(
    //   "readBandsSaga=" + JSON.stringify(item, null, 4).substring(0, 500)
    // );
    yield put(appearancesDuxActions.setFetchAppearancesSucceeded(item.value));
  }
}

function* readStagesSaga() {
  // console.log("running updatedItemSaga...");
  yield put(stagesDuxActions.setFetchStagesRequest());

  const updateChannel = createEventChannel(
    firebaseApp.database().ref(globalTypes.DATABASE.STAGES_PATH)
  );

  while (true) {
    const item = yield take(updateChannel);
    // console.log(
    //   "readStagesSaga=" + JSON.stringify(item, null, 4).substring(0, 500)
    // );
    yield put(stagesDuxActions.setFetchStagesSucceeded(item.value));
  }
}

// function* mySaga() {
//   yield fork(readBandsSaga);
//   yield fork(readHomeSaga);
//   yield fork(readStagesSaga);
//   yield fork(readAppearancesSaga);
// }

// export default mySaga;

const readFirebaseDataSagas = [
  fork(readBandsSaga),
  fork(readHomeSaga),
  fork(readStagesSaga),
  fork(readAppearancesSaga),
  fork(readDatesSaga),
  fork(readContactUsSaga),
  fork(readPhotosMetaSaga)
];

export default readFirebaseDataSagas;
