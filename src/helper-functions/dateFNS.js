import { format as dateFnsFormat } from "date-fns";
import dateFnsLocalizer from "react-widgets-date-fns";
// import { dateFormatString } from "../constants/formats.js";
import enGB from "date-fns/locale/en-GB";

dateFnsLocalizer({ locales: { "en-GB": enGB } });

export const fnsDateToISOText = theDate => dateFnsFormat(theDate, "YYYY-MM-DD");

export const fnsDateTimeToISOText = theFnsDate =>
  dateFnsFormat(theFnsDate, "YYYY-MM-DDTHH:mm");

export const textDatesToFnsDates = textDateList =>
  textDateList.map(textDate => {
    const newDate = new Date(textDate);
    return newDate;
  });

export const fnsDatesToISOText = dateList => {
  // console.log("fnsDatesToISOText, dateFnsFormat=" + dateFnsFormat);
  return dateList.map(dateMember => dateFnsFormat(dateMember, "YYYY-MM-DD"));
};


export const getDatePortionFromISOTimeString = dateTimeISOString => {
  // dateTimeISOString should be in format "2018-07-22T17:00", but there was an issue
  // where the "T" was replaced by a space
  if (dateTimeISOString.indexOf("T") >= 0) {
    return dateTimeISOString.split("T")[0];
  }
  if (dateTimeISOString.indexOf(" ") >= 0) {
    return dateTimeISOString.split(" ")[0];
  }
  return dateTimeISOString;
};
