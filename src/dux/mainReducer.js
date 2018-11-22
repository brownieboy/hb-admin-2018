import { combineReducers } from "redux";
import { reducer as notifications } from "react-redux-notify";
// import notifications from "react-redux-notify";


import homeReducer from "./homeReducer.js";
import bandsReducer from "./bandsReducer";
import appearancesReducer from "./appearancesReducer.js";
import stagesReducer from "./stagesReducer.js";
import firebaseLoginReducer from "./firebaseLoginReducer.js";
import datesReducer from "./datesReducer.js";
// import storageReducer from "./storageReducer";
import photosStorageReducer from "./photosStorageReducer.js";
import publishReducer from "./publishReducer.js";
import contactsReducer from "./contactUsReducer.js";
import photosReducer from "./photosReducer.js";
// import { getAppearancesWithBandAndStageNames as fromAppearancesGetAppearancesWithBandAndStageNames } from "./appearancesReducer.js";

const mainReducer = combineReducers({
  notifications,
  appearancesState: appearancesReducer,
  bandsState: bandsReducer,
  contactUsState: contactsReducer,
  homeState: homeReducer,
  firebaseLoginState: firebaseLoginReducer,
  publishState: publishReducer,
  stagesState: stagesReducer,
  datesState: datesReducer,
  // storageState: storageReducer,
  photosStorageState: photosStorageReducer,
  photosState: photosReducer
});

export default mainReducer;

// export const getAppearancesWithBandAndStageNames = state =>
//   fromAppearancesGetAppearancesWithBandAndStageNames(state);
