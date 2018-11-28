import { call, put, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { reduxSagaFirebase } from "../../apis/firebase-dev.js";
import {
  notifySuccess,
  notifyError,
  notifyWarning
  // notifyInfo
} from "../react-redux-notify-helpers.js";

import {
  START_PHOTO_FILE_UPLOAD,
  updatePhotoFileUrl
} from "../photosReducer.js";

import {
  sendPhotoStorageStart,
  updatePhotoStorageStatus,
  sendPhotoStorageSuccess,
  DELETE_STORAGE_PHOTOS
  // sendPhotoStorageFailure
} from "../photosStorageReducer.js";

// import {
//   actionTypes as bandActionTypes,
//   bandsDuxActions
// } from "../bandsReducer.js";

// import {
//   actionTypes as stageActionTypes,
//   stagesDuxActions
// } from "../stagesReducer.js";

// import firebaseApp from "../../apis/firebase-dev.js";

import {
  // types as globalTypes,
  getPhotoStoragePath
} from "../../constants/firebasePaths.js";

function* syncFileUrl(filePath) {
  try {
    const url = yield call(reduxSagaFirebase.storage.getDownloadURL, filePath);
    return url;
  } catch (error) {
    return console.error(error);
  }
}

function* handleEventEmit(snapshot, id) {
  // yield console.log("saga handleEventEmitThumb started, snapshot:");
  // yield console.log(snapshot);
  // yield console.log("handleEventEmit, id: " + id);
  const progress = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
  yield put(
    updatePhotoStorageStatus(id, {
      percentUploaded: progress
    })
  );
}

export function* uploadImage(data) {
  // yield console.log("saga uploadImage started, data:");
  // yield console.log(data);
  const { storagePath } = data.payload;

  yield put(sendPhotoStorageStart(data.payload.id, data.payload));
  const file = yield data.payload.fileInfo;
  const filePath = yield `${storagePath}/${file.name}`;

  const task = reduxSagaFirebase.storage.uploadFile(filePath, file);

  const channel = eventChannel(emit => task.on("state_changed", emit));
  yield takeEvery(channel, snapshot =>
    handleEventEmit(snapshot, data.payload.id)
  );

  yield task;
  const downloadUrl = yield syncFileUrl(filePath);

  // Triggers SEND_PHOTO_STORAGE_SUCCESS action from photosStorageReducer
  yield put(sendPhotoStorageSuccess(data.payload.id, downloadUrl));
  yield put(
    notifySuccess(
      `Photo binary for ${
        data.payload.assocEntityName
      } uploaded to server okay.`
    )
  );
  yield put(
    notifyWarning(
      "You should hit the Save button now to lock in the new URL to this Photo."
    )
  );

  // const putOnSuccessObj = { downloadUrl, payload: data.payload };
  const putOnSuccessObj = { ...data.payload, downloadUrl, filePath };
  // console.log("uploadFirebaseImagesSagas.js uploadImage, putOnSuccessObj:");
  // console.log(putOnSuccessObj);
  // Triggers UPDATE_PHOTO_FILE_URL action from photosReducer
  yield put(updatePhotoFileUrl(putOnSuccessObj));
}

function* deletePhotosFromStorage(deletePhotosAction) {
  // deletePhotosAction.payload has been pre-processed to be array of
  // photo objects, which have all the info that we need.
  // yield console.log(
  //   "deletePhotosFromStorage saga has listened, deletePhotosAction.payload :"
  // );
  // yield console.log(deletePhotosAction.payload);
  // const storageRef = firebaseApp.storage().ref();
  let filePathToDelete, deleteResponse;

  //   const responseArray = yield newData.map(newPost => call(dummyPromise, 500, newData[0]));
  const responseArray = yield deletePhotosAction.payload.map(function*(
    photoObj
  ) {
    filePathToDelete = photoObj.filePath
      ? photoObj.filePath
      : `${getPhotoStoragePath(photoObj.type, photoObj.photoType)}/${
          photoObj.fileName
        }`;

    try {
      // deleteResponse = yield call(
      //   reduxSagaFirebase.storage.getFileMetadata,
      //   filePathToDelete
      // );

      deleteResponse = yield call(
        reduxSagaFirebase.storage.deleteFile,
        filePathToDelete
      );

      // console.log("success fetch meta data, deleteResponse:");
      // console.log({ resultType: "success", deleteResponse });
      yield put(
        notifySuccess(
          `Succesfully deleted file ${filePathToDelete} from server storage.`
        )
      );
      return { resultType: "success", deleteResponse };
    } catch (e) {
      // console.log("error fetch meta data, e:");
      // console.log({ resultType: "failure", deleteResponse: e });
      yield put(
        notifyError(
          `Error deleting file ${
            photoObj.fileName
          } from server storage.  Error is: ${JSON.stringify(e)}`
        )
      );
      return { resultType: "failure", deleteResponse: e };
    }
  });
  // console.log("responseArray:");
  // console.log(responseArray);

  return responseArray;
}

const uploadFirebaseImagesSagas = [
  takeEvery(START_PHOTO_FILE_UPLOAD, uploadImage),
  takeEvery(DELETE_STORAGE_PHOTOS, deletePhotosFromStorage)
];

export default uploadFirebaseImagesSagas;
