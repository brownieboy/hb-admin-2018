// Selectors don't like being called from each other's files. They will give
// a circular dependency error, the message for which gives no clue that's
// actually the problem.

import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import {
  // getPhotoInfoForId,
  getPhotoInfoFromListForId
} from "../photosReducer.js";

import {
  stringSort,
  stringSortIgnoreArticle
} from "../../helper-functions/sorting.js";

import { selectCurrentYear } from "../datesReducer.js";

// Selectors
// const getState = state => state;
const getAllPhotos = state => state.photosState.photosList; // not actually a selector
export const selectBands = state => state.bandsState.bandsList || [];
export const selectStages = state =>
  state.stagesState.stagesList.sort((a, b) => a.sortOrder - b.sortOrder);
const getAppearances = state => state.appearancesState.appearancesList;

export const selectAppearancesByDateTime = createSelector(
  [getAppearances],
  appearances =>
    [...appearances].sort(
      (a, b) => new Date(a.dateTimeStart) - new Date(b.dateTimeStart)
    )
);

export const selectPhotos = createSelector([getAllPhotos], photosList =>
  stringSort(photosList, "fileName")
);

// Note: assocEntityName doesn't mean that entity is currently
// using this photo meta.  It only memans that it *could* be using it!
// To see whether a band or stage *is* actually using a particular photo
// meta doc, then we need to check the band or stage thumbPhotoId or
// cardPhotoId properties.
export const selectPhotosEnhanced = createSelector(
  [selectPhotos, selectBands, selectStages],

  (photosList, bandsList, stagesList) =>
    photosList.map(photoMember => {
      let matchingThumbs, matchingCards, matchingEntityObj;
      if (photoMember.type === "band") {
        matchingEntityObj = bandsList.find(
          bandMember => bandMember.id === photoMember.assocEntityId
        );
        if (photoMember.photoType === "thumb") {
          matchingThumbs = bandsList.filter(
            bandMember => bandMember.thumbPhotoId === photoMember.id
          );
        } else if (photoMember.photoType === "card") {
          matchingCards = bandsList.filter(
            bandMember => bandMember.cardPhotoId === photoMember.id
          );
        }
      } else if (photoMember.type === "stage") {
        matchingEntityObj = stagesList.find(
          stageMember => stageMember.id === photoMember.assocEntityId
        );
        if (photoMember.photoType === "thumb") {
          matchingThumbs = stagesList.filter(
            stageMember => stageMember.thumbPhotoId === photoMember.id
          );
        } else if (photoMember.photoType === "card") {
          matchingCards = stagesList.filter(
            stageMember => stageMember.cardPhotoId === photoMember.id
          );
        }
      }
      if (matchingEntityObj) {
        photoMember.assocEntityName = matchingEntityObj.name;
      }
      if (matchingThumbs) {
        photoMember.matchingThumbs = matchingThumbs;
      }
      if (matchingCards) {
        photoMember.matchingCards = matchingCards;
      }
      return photoMember;
    })
);

// Filters for the view tabs.
export const selectBandPhotos = createSelector(
  [selectPhotosEnhanced],
  photosList =>
    stringSortIgnoreArticle(
      photosList.filter(photoMember => photoMember.type === "band"),
      "assocEntityName"
    )
);
export const selectStagePhotos = createSelector(
  [selectPhotosEnhanced],
  photosList => photosList.filter(photoMember => photoMember.type === "stage")
);

const selectBandCards = createSelector([selectBandPhotos], photosList =>
  photosList.filter(photoMember => photoMember.photoType === "card")
);
const selectBandThumbs = createSelector([selectBandPhotos], photosList =>
  photosList.filter(photoMember => photoMember.photoType === "thumb")
);

export const selectCardPhotosForBand = createCachedSelector(
  selectBandCards,
  (state, bandId) => bandId,
  (photosList, bandId) =>
    photosList.filter(photoMember => photoMember.assocEntityId === bandId)
)((state, bandId) => bandId);

export const selectThumbPhotosForBand = createCachedSelector(
  selectBandThumbs,
  (state, bandId) => bandId,
  (photosList, bandId) =>
    photosList.filter(photoMember => photoMember.assocEntityId === bandId)
)((state, bandId) => bandId);

// const selectAppearancesForBandId = createCachedSelector(
//   selectAppearancesByDateTime,
//   (state, bandId) => {
//     // console.log("selectAppearancesForBandId 1st func bandId" + bandId);
//     return bandId;
//   },
//   (appearancesList, bandId) => {
//     // console.log("selectAppearancesForBandId 2nd fun bandId" + bandId);
//     return appearancesList.filter(appearance => appearance.bandId === bandId);
//   }
// )((state, bandId) => bandId);

export const selectBandsAlphabetical = createSelector(
  [selectBands],
  bandsList => stringSortIgnoreArticle(bandsList.slice(), "name")
);

// Enhanced with photo info only at this point.
export const selectBandsAlphabeticalEnhanced = createSelector(
  [selectBandsAlphabetical, selectPhotos, selectAppearancesByDateTime],
  (bandsList, photosList, appearancesList) =>
    bandsList.map(bandMember => {
      let matchingCardPhotoInfo, matchingThumbPhotoInfo;
      if (bandMember.cardPhotoId) {
        matchingCardPhotoInfo = photosList.find(
          photoMember => photoMember.id === bandMember.cardPhotoId
        );
      }
      if (bandMember.thumbPhotoId) {
        matchingThumbPhotoInfo = photosList.find(
          photoMember => photoMember.id === bandMember.thumbPhotoId
        );
      }
      const matchingAppearancesList = appearancesList.filter(
        appearance => appearance.bandId === bandMember.id
      );

      // This syntax take from http://2ality.com/2017/04/conditional-literal-entries.html
      // Note that assigning the empty object actually does not assign anything.
      const newBandMember = {
        ...bandMember,
        ...(matchingCardPhotoInfo
          ? { cardPhotoInfo: matchingCardPhotoInfo }
          : {}),
        ...(matchingThumbPhotoInfo
          ? { thumbPhotoInfo: matchingThumbPhotoInfo }
          : {}),
        ...(matchingAppearancesList.length > 0
          ? { appearancesList: matchingAppearancesList }
          : {})
      };
      return newBandMember;
    })
);

export const selectThisYearsBands = createSelector(
  [selectBandsAlphabeticalEnhanced, selectCurrentYear],
  (bandsList, currentFestivalYear) =>
    bandsList.filter(
      bandMember =>
        typeof bandMember.yearsAppearing !== "undefined" &&
        bandMember.yearsAppearing.includes(currentFestivalYear)
    )
);

// Publish this year's bands only.  Need to map field from photo info objects
// to final fields in the published data.
export const selectBandsPublish = createSelector(
  [selectThisYearsBands],
  bandsList =>
    bandsList.map(bandMember => ({
      ...bandMember,
      id: bandMember.id,
      name: bandMember.name,
      cardFullUrl: bandMember.cardPhotoInfo
        ? bandMember.cardPhotoInfo.fullUrl
        : "",
      thumbFullUrl: bandMember.thumbPhotoInfo
        ? bandMember.thumbPhotoInfo.fullUrl
        : "",
      cardPhotoInfo: {},
      thumbPhotoInfo: {}
    }))
);

export const selectStagesEnhanced = createSelector(
  [selectStages, selectPhotos, selectAppearancesByDateTime],
  (stagesList, photosList, appearancesList) =>
    stagesList.map(stageMember => {
      let matchingCardPhotoInfo, matchingThumbPhotoInfo;
      if (stageMember.cardPhotoId) {
        matchingCardPhotoInfo = getPhotoInfoFromListForId(
          photosList,
          stageMember.cardPhotoId
        );
      }
      if (stageMember.thumbPhotoId) {
        matchingThumbPhotoInfo = getPhotoInfoFromListForId(
          photosList,
          stageMember.thumbPhotoId
        );
      }

      const matchingAppearancesList = appearancesList.filter(
        appearance => appearance.stageId === stageMember.id
      );

      // This syntax take from http://2ality.com/2017/04/conditional-literal-entries.html
      // Note that assigning the empty object actually does not assign anything.
      const newStageMember = {
        ...stageMember,
        ...(matchingCardPhotoInfo
          ? { cardPhotoInfo: matchingCardPhotoInfo }
          : {}),
        ...(matchingThumbPhotoInfo
          ? { thumbPhotoInfo: matchingThumbPhotoInfo }
          : {}),
        ...(matchingAppearancesList.length > 0
          ? { appearancesList: matchingAppearancesList }
          : {})
      };
      return newStageMember;
    })
);

// Publish all stages.  Need to fill in the photo
// URLs from the matching photo objects.
export const selectStagesPublish = createSelector(
  [selectStagesEnhanced],
  stagesList =>
    stagesList.map(stageMember => ({
      ...stageMember,
      id: stageMember.id,
      name: stageMember.name,
      cardFullUrl: stageMember.cardPhotoInfo
        ? stageMember.cardPhotoInfo.fullUrl
        : "",
      thumbFullUrl: stageMember.thumbPhotoInfo
        ? stageMember.thumbPhotoInfo.fullUrl
        : "",
      cardPhotoInfo: {},
      thumbPhotoInfo: {}
    }))
);

// Cut down version for form drop-down control select values
export const selectBandsPicker = createSelector(
  [selectBandsAlphabetical],
  bandsList =>
    bandsList.map(bandMember => ({
      id: bandMember.id,
      name: bandMember.name
    }))
);

const selectStageCards = createSelector([selectStagePhotos], photosList =>
  photosList.filter(photoMember => photoMember.photoType === "card")
);
const selectStageThumbs = createSelector([selectStagePhotos], photosList =>
  photosList.filter(photoMember => photoMember.photoType === "thumb")
);

export const selectCardPhotosForStage = createCachedSelector(
  selectStageCards,
  (state, stageId) => stageId,
  (photosList, stageId) =>
    photosList.filter(photoMember => photoMember.assocEntityId === stageId)
)((state, stageId) => stageId);

export const selectThumbPhotosForStage = createCachedSelector(
  selectStageThumbs,
  (state, stageId) => stageId,
  (photosList, stageId) =>
    photosList.filter(photoMember => photoMember.assocEntityId === stageId)
)((state, stageId) => stageId);

// Cut down version for form drop-down control select values, for this
// year's bands only
export const selectBandsPickerThisYear = createSelector(
  [selectThisYearsBands],
  bandsList =>
    bandsList.map(bandMember => ({
      id: bandMember.id,
      name: bandMember.name
    }))
);

export const selectStagesPicker = createSelector([selectStages], stagesList =>
  stagesList.map(stageMember => ({
    id: stageMember.id,
    name: stageMember.name
  }))
);
