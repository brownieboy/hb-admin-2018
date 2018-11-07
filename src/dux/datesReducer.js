import { createSelector } from "reselect";
import { getYear } from "date-fns";
import { textDatesToFnsDates } from "../helper-functions/dateFNS.js";

// The three (or more!!!) dates upon which the festival is running this year
// Action type constants
const LOAD_DATES_NOW = "LOAD_DATES_NOW"; // Imperative, hence "NOW"!
const FETCH_DATES_REQUEST = "FETCH_DATES_REQUEST";
const FETCH_DATES_SUCCESS = "FETCH_DATES_SUCCESS";
const FETCH_DATES_FAILURE = "FETCH_DATES_FAILURE";
const SAVE_EDITED_DATES = "SAVE_EDITED_DATES";
const SAVE_DATES_REQUEST = "SAVE_DATES_REQUEST";
const SAVE_DATES_SUCCESS = "SAVE_DATES_SUCCESS";
const SAVE_DATES_FAILED = "SAVE_DATES_FAILED";

export const actionTypes = {
  SAVE_EDITED_DATES,
  SAVE_DATES_REQUEST,
  SAVE_DATES_SUCCESS,
  SAVE_DATES_FAILED
};

// Reducer

const defaultDates = [new Date(), new Date(), new Date()];

const datesReducer = (
  state = {
    fetchStatus: "",
    fetchError: "",
    saveStatus: "",
    saveError: "",
    datesList: defaultDates.slice()
  },
  action
) => {
  switch (action.type) {
    case FETCH_DATES_REQUEST:
      return { ...state, fetchStatus: "loading" };
    case FETCH_DATES_SUCCESS:
      return {
        ...state,
        fetchStatus: "",
        datesList: action.payload
      };
    case FETCH_DATES_FAILURE:
      return { ...state, fetchStatus: "failure", fetchError: action.payload };
    default:
      return state;
  }
};

const datesList = state => state.datesState.datesList;
const datesFnsList = createSelector([datesList], dList =>
  textDatesToFnsDates(dList)
);

export const selectCurrentYear = createSelector(
  [datesFnsList],
  dList => (dList ? getYear(dList[0]) : null)
);

export const yearsAvailable = createSelector(
  [selectCurrentYear],
  currentYear => {
    // console.log("yearsAvailable, currentYear=" + currentYear);
    const yearsRange = [];
    for (let x = 2018; x <= currentYear + 1; x++) {
      yearsRange.push(x);
    }
    // console.log("yearsAvailable, yearsRange=" + yearsRange);
    return yearsRange;
  }
);

export const loadDatesNow = () => ({ type: LOAD_DATES_NOW });

const setFetchDatesRequest = () => ({
  type: FETCH_DATES_REQUEST
});
const setFetchDatesSucceeded = dList => ({
  type: FETCH_DATES_SUCCESS,
  payload: dList ? dList : defaultDates.slice()
});
const setFetchDatesFailed = errorMessage => ({
  type: FETCH_DATES_FAILURE,
  payload: errorMessage
});

export const saveEditedDates = dList => ({
  type: SAVE_EDITED_DATES,
  payload: dList || []
});

export const saveDatesRequest = () => ({
  type: SAVE_DATES_REQUEST
});

export const saveDatesSucceeded = () => ({
  type: SAVE_DATES_SUCCESS
});

export const saveDatesFailed = error => ({
  type: SAVE_DATES_FAILED,
  payload: error
});

export const datesDuxActions = {
  setFetchDatesFailed,
  setFetchDatesRequest,
  setFetchDatesSucceeded,
  saveDatesRequest,
  saveDatesSucceeded,
  saveEditedDates,
  saveDatesFailed
};

export default datesReducer;
