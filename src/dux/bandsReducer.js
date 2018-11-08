// import { createSelector } from "reselect";

// import { selectCurrentYear } from "./datesReducer.js";
// import { getPhotoInfoForId } from "./photosReducer.js";
// import { stringSortIgnoreArticle } from "../helper-functions/sorting.js";

// Action type constants
const LOAD_BANDS_NOW = "LOAD_BANDS_NOW"; // Imperative, hence "NOW"!
const FETCH_BANDS_REQUEST = "FETCH_BANDS_REQUEST";
const FETCH_BANDS_SUCCESS = "FETCH_BANDS_SUCCESS";
const FETCH_BANDS_FAILURE = "FETCH_BANDS_FAILURE";
const SAVE_NEW_BAND = "SAVE_NEW_BAND";
const SAVE_EDITED_BAND = "SAVE_EDITED_BAND";
const SAVE_BAND_REQUEST = "SAVE_BAND_REQUEST";
const SAVE_BAND_SUCCESS = "SAVE_BAND_SUCCESS";
const SAVE_BAND_FAILED = "SAVE_BAND_FAILED";
const SAVE_BAND_CLEAR = "SAVE_BAND_CLEAR";
const DELETE_BANDS = "DELETE_BANDS";
const ADD_BANDS_TO_APPEAR_IN_YEAR = "ADD_BANDS_TO_APPEAR_IN_YEAR";
const REMOVE_BANDS_FROM_APPEARING_IN_YEAR =
  "REMOVE_BANDS_FROM_APPEARING_IN_YEAR";
const ADJUST_BANDS_SAVE = "ADJUST_BANDS_SAVE";
const CLEAR_THUMB_PHOTOS_FROM_BANDS = "CLEAR_THUMB_PHOTOS_FROM_BANDS";
const CLEAR_CARD_PHOTOS_FROM_BANDS = "CLEAR_CARD_PHOTOS_FROM_BANDS";
const SAVE_BANDS_TO_SERVER = "SAVE_BANDS_TO_SERVER";

export const actionTypes = {
  SAVE_NEW_BAND,
  SAVE_EDITED_BAND,
  SAVE_BAND_REQUEST,
  SAVE_BAND_SUCCESS,
  SAVE_BAND_FAILED,
  DELETE_BANDS,
  ADJUST_BANDS_SAVE
};

// Reducer
const bandsReducer = (
  state = {
    fetchStatus: "",
    fetchError: "",
    bandsList: [],
    cardFileInfo: "",
    thumbFileInfo: ""
  },
  action
) => {
  let idx, newBandsList;
  switch (action.type) {
    case FETCH_BANDS_REQUEST:
      return { ...state, fetchStatus: "loading" };
    case FETCH_BANDS_SUCCESS:
      console.log("FETCH_BANDS_SUCCESS");
      return {
        ...state,
        fetchStatus: "",
        bandsList: action.payload
      };
    case FETCH_BANDS_FAILURE:
      return { ...state, fetchStatus: "failure", fetchError: action.payload };
    case SAVE_NEW_BAND:
      return { ...state, bandsList: [...state.bandsList, action.payload] };
    case SAVE_BAND_REQUEST:
      return {
        ...state,
        saveStatus: "saving"
      };
    case SAVE_BAND_SUCCESS:
      return {
        ...state,
        saveStatus: "success"
      };
    case SAVE_BAND_CLEAR:
      return {
        ...state,
        saveStatus: ""
      };
    case SAVE_BAND_FAILED:
      return { ...state, saveStatus: "failure", saveError: action.payload };
    case SAVE_EDITED_BAND:
      idx = state.bandsList.findIndex(
        bandObj => bandObj.id === action.payload.id
      );
      newBandsList = [
        ...state.bandsList.slice(0, idx),
        action.payload,
        ...state.bandsList.slice(idx + 1)
      ];
      return { ...state, bandsList: newBandsList };

    case DELETE_BANDS:
      newBandsList = state.bandsList.filter(
        bandMember => action.payload.indexOf(bandMember.id) < 0
      );
      return { ...state, bandsList: newBandsList };

    case ADD_BANDS_TO_APPEAR_IN_YEAR:
      // newBandsList = state.bandsList.slice(); // Defensive copy
      newBandsList = state.bandsList.map(bandMember => {
        if (action.payload.bandIdsArray.indexOf(bandMember.id) >= 0) {
          if (typeof bandMember.yearsAppearing === "undefined") {
            bandMember.yearsAppearing = [action.payload.theYear];
          } else if (
            !bandMember.yearsAppearing.includes(action.payload.theYear)
          ) {
            bandMember.yearsAppearing = [
              ...bandMember.yearsAppearing,
              action.payload.theYear
            ];
          }
        }
        return bandMember;
      });
      return { ...state, bandsList: newBandsList };

    case REMOVE_BANDS_FROM_APPEARING_IN_YEAR:
      // newBandsList = state.bandsList.slice(); // Defensive copy not needed as map returns new array
      newBandsList = state.bandsList.map(bandMember => {
        if (action.payload.bandIdsArray.indexOf(bandMember.id) >= 0) {
          if (typeof bandMember.yearsAppearing === "object") {
            if (bandMember.yearsAppearing.includes(action.payload.theYear)) {
              bandMember.yearsAppearing = bandMember.yearsAppearing.filter(
                member => member !== action.payload.theYear
              );
            }
          }
        }
        return bandMember;
      });
      return { ...state, bandsList: newBandsList };

    case CLEAR_THUMB_PHOTOS_FROM_BANDS:
      console.log("CLEAR_THUMB_PHOTOS_FROM_BANDS");
      // action.payload.photoIDsArray is the list of thumb photo IDs that we need to
      // clear.  We need to check the thumbPhotoId against this id
      newBandsList = state.bandsList.map(bandMember => {
        if (
          bandMember.thumbPhotoId &&
          action.payload.photoIDsArray.includes(bandMember.thumbPhotoId)
        ) {
          // We can use Object Rest to discard thumbPhotoId from the existing object
          // and then just take the remainder.  See:
          // https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90
          const { thumbPhotoId, ...remainderObj } = bandMember;
          return remainderObj;
        }
        return { ...bandMember };
      });
      return { ...state, bandsList: newBandsList };

    case CLEAR_CARD_PHOTOS_FROM_BANDS:
      newBandsList = state.bandsList.map(bandMember => {
        if (
          bandMember.cardPhotoId &&
          action.payload.photoIDsArray.includes(bandMember.cardPhotoId)
        ) {
          const { cardPhotoId, ...remainderObj } = bandMember;
          return remainderObj;
        }
        return { ...bandMember };
      });
      return { ...state, bandsList: newBandsList };
    default:
      return state;
  }
};

// Sort/filter functions for selectors
export const selectBands = state => state.bandsState.bandsList || [];

// Getters don't use redux-select, so are bad, but flexible.
export const getBandInfoForId = (bandsList, bandId) =>
  bandsList ? bandsList.find(bandMember => bandMember.id === bandId) : null;

// const getBandsAlphabetical = state =>
//   stringSortIgnoreArticle([...state.bandsStorage.bandsList], "name");

// Need to add the URLs here.
// export const getBandsAlphabeticalEnhanced = state => {
//   const newBandsList = getBandsAlphabetical(state);
//   return newBandsList.map(bandMember => ({
//     ...bandMember,
//     bandId: bandMember.id
//   }));
// };

// const selectThisYearsBands = createSelector(
//   [selectAlphabetical, selectCurrentYear],
//   (bandsList, currentFestivalYear) =>
//     bandsList.filter(
//       bandMember =>
//         typeof bandMember.yearsAppearing !== "undefined" &&
//         bandMember.yearsAppearing.includes(currentFestivalYear)
//     )
// );

// export const getBandsForPublish = state => {
//   const newBandsList = getBandsAlphabeticalEnhanced(state);
//   return newBandsList.map(bandMember => {
//     let matchingCardPhotoInfo, matchingThumbPhotoInfo;
//     if (bandMember.cardPhotoId && bandMember.cardPhotoId !== "") {
//       matchingCardPhotoInfo = getPhotoInfoForId(state, bandMember.cardPhotoId);
//     }
//     if (bandMember.thumbPhotoId && bandMember.thumbPhotoId !== "") {
//       matchingThumbPhotoInfo = getPhotoInfoForId(
//         state,
//         bandMember.thumbPhotoId
//       );
//     }
//     return {
//       ...bandMember,
//       bandId: bandMember.id,
//       cardFullUrl: matchingCardPhotoInfo ? matchingCardPhotoInfo.fullUrl : "",
//       thumbFullUrl: matchingThumbPhotoInfo ? matchingThumbPhotoInfo.fullUrl : ""
//     };
//   });
// };

// export const bandsDuxConstants = {
//   LOAD_BANDS_NOW,
//   FETCH_BANDS_REQUEST,
//   FETCH_BANDS_SUCCESS,
//   FETCH_BANDS_FAILURE
// };

/*
// Sort/filter functions for selectors
const selectPeople = state => state.people.peopleList;
// const selectSortStyle = state => state.people.sortStyle;

// Selectors
const selectPeopleDateStartReverse = createSelector(
  [selectPeople],
  peopleList =>
    peopleList
      .slice()
      .sort((a, b) => new Date(b.dateTimeStart) - new Date(a.dateTimeStart))
);

const selectPeopleAlpha = createSelector([selectPeople], peopleList =>
  stringSort(peopleList.slice(), "name")
);

const selectPeopleStateSortOrder = createSelector([selectPeople], peopleList =>
  peopleList.slice().sort((a, b) => a.stateSortOrder - b.stateSortOrder)
);

const selectPeopleStateSortOrderThenDate = createSelector(
  [selectPeople],
  peopleList =>
    peopleList
      .slice()
      .sort(
        (a, b) =>
          a.stateSortOrder - b.stateSortOrder ||
          (a.dateTimeStart && b.dateTimeStart
            ? new Date(a.dateTimeStart) - new Date(b.dateTimeStart)
            : 1)
      )
);

export const selectors = {
  selectPeopleAlpha,
  selectPeopleDateStartReverse,
  selectPeopleStateSortOrder,
  selectPeopleStateSortOrderThenDate
};


 */

export const loadBandsNow = () => ({ type: LOAD_BANDS_NOW });
// export const fetchBandsSucceeded = () => ({ type: FETCH_BANDS_REQUEST });

const setFetchBandsRequest = () => ({
  type: FETCH_BANDS_REQUEST
});
const setFetchBandsSucceeded = bandsList => ({
  type: FETCH_BANDS_SUCCESS,
  payload: bandsList || []
});
const setFetchBandsFailed = errorMessage => ({
  type: FETCH_BANDS_FAILURE,
  payload: errorMessage
});

export const saveNewBand = bandInfo => ({
  type: SAVE_NEW_BAND,
  payload: bandInfo
});

export const saveEditedBand = bandInfo => ({
  type: SAVE_EDITED_BAND,
  payload: bandInfo
});

export const saveBandRequest = () => ({
  type: SAVE_BAND_REQUEST
});

export const saveBandSucceeded = () => ({
  type: SAVE_BAND_SUCCESS
});

export const saveBandClear = () => ({
  type: SAVE_BAND_CLEAR
});

export const saveBandFailed = error => ({
  type: SAVE_BAND_FAILED,
  payload: error
});

export const deleteBands = bandIdsArray => ({
  type: DELETE_BANDS,
  payload: bandIdsArray
});

// Trigger for saga to save back end data, like when we've added
// or removed them from this year's lineup.
export const adjustBandsSave = () => ({
  type: ADJUST_BANDS_SAVE
});

export const addBandsToAppearInYear = (bandIdsArray, theYear) => ({
  type: ADD_BANDS_TO_APPEAR_IN_YEAR,
  payload: { bandIdsArray, theYear }
});

export const removeBandsFromAppearingInYear = (bandIdsArray, theYear) => ({
  type: REMOVE_BANDS_FROM_APPEARING_IN_YEAR,
  payload: { bandIdsArray, theYear }
});

export const clearThumbPhotosFromBands = photoIDsArray => ({
  type: CLEAR_THUMB_PHOTOS_FROM_BANDS,
  payload: { photoIDsArray }
});

export const clearCardPhotosFromBands = photoIDsArray => ({
  type: CLEAR_CARD_PHOTOS_FROM_BANDS,
  payload: { photoIDsArray }
});

// Does nothing here.  Listend to by wireFirebasePhotoSagas.js
export const saveBandsToServer = () => ({
  type: SAVE_BANDS_TO_SERVER
});

export const bandsDuxActions = {
  // bandStartCardFileUpload,
  // bandStartThumbFileUpload,
  setFetchBandsFailed,
  setFetchBandsRequest,
  setFetchBandsSucceeded,
  saveBandRequest,
  saveBandSucceeded,
  saveNewBand,
  saveBandFailed
};

export default bandsReducer;

// A thunk must return a function, hence the double () => dispatch =>
// export const loadBands = () => dispatch => {
//   dispatch(loadingBands(true));
//   bandsApi
//     .getBandsData()
//     .then(bandsData => {
//       // addFireBaseImagesToData(bandsData);
//       console.log(
//         "bandsData in reducer=" + JSON.stringify(bandsData[0], null, 4)
//       );
//       dispatch(
//         batchActions([loadedBandsSuccess(bandsData), loadingBands(false)])
//       );
//     })
//     .catch(err => {
//       console.log(`error in data retrieval: ${err}`);
//       dispatch(batchActions([loadedBandsFailure(), loadingBands(false)]));
//       return err;
//     });
// };
