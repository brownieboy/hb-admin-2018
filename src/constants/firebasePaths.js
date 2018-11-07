export const types = {
  DATABASE: {
    STAGES_PATH: "stages",
    BANDS_PATH: "bands",
    DATES_PATH: "dates",
    HOME_PAGE_PATH: "homePage",
    CONTACTUS_PAGE_PATH: "contactsPage",
    APPEARANCES_PATH: "appearances",
    PUBLISHED_DATA_PATH: "publishedData",
    PHOTOS_META_PATH: "photoMeta"
  },
  STORAGE: {
    BANDS_THUMBS_PATH: "/img/bands/thumbs",
    BANDS_CARDS_PATH: "/img/bands/cards",
    STAGES_THUMBS_PATH: "/img/stages/thumbs",
    STAGES_CARDS_PATH: "/img/stages/cards"
  }
};

export const getPhotoStoragePath = (type, photoType) => {
  let storageFilePath = "img/misc"; // So it goes somewhere!
  if (type === "band") {
    if (photoType === "thumb") {
      storageFilePath = types.STORAGE.BANDS_THUMBS_PATH;
    } else {
      storageFilePath = types.STORAGE.BANDS_CARDS_PATH;
    }
  } else if (type === "stage") {
    if (photoType === "thumb") {
      storageFilePath = types.STORAGE.STAGES_THUMBS_PATH;
    } else {
      storageFilePath = types.STORAGE.STAGES_CARDS_PATH;
    }
  }
  return storageFilePath;
};
