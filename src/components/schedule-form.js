// Render Prop
import React, { Component } from "react";
import { Redirect } from "react-router";
import { Formik } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import { Button, FormGroup, Label, Input } from "reactstrap";
import dateFnsLocalizer from "react-widgets-date-fns";
import enGB from "date-fns/locale/en-GB";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import { format as dateFnsFormat } from "date-fns";
import shortId from "shortid";
import SelectList from "react-widgets/lib/SelectList";
import "react-widgets/dist/css/react-widgets.css";
import { dateFormatString, timeFormatString } from "../constants/formats.js";
import {
  LoadStatusIndicator,
  SaveStatusIndicator
} from "./loadsaveindicator.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";

dateFnsLocalizer({ "en-GB": enGB });

const validationSchemaCommonObj = {
  bandId: yup.string().required(),
  stageId: yup.string().required(),
  dateDay: yup.string().required(),
  timeStart: yup.date().required(),
  timeEnd: yup.date().required()
};

const renderOptionsField = dataArray =>
  dataArray.map(dataMember => (
    <option key={dataMember.id} value={dataMember.id}>
      {dataMember.name}
    </option>
  ));

const renderSelectDates = datesList =>
  datesList.map(dateMember => ({
    valueField: dateMember,
    textField: dateFnsFormat(dateMember, dateFormatString)
  }));

class AppearanceForm extends Component {
  classId = "";

  componentWillUnmount() {
    console.log("Clearing from componentWillUnmount");
    if (this.props.saveAppearanceClear) {
      this.props.saveAppearanceClear(); // Clear saveSuccess status so we don't loop
    }
  }

  render() {
    const {
      datesList,
      getAppearanceInfoForId,
      isEditExisting,
      match,
      submitDataToServer,
      notifyInfo,
      isLoggedIn,
      bandsPicker,
      stagesPicker,
      fetchStatus,
      fetchError,
      saveStatus,
      saveError
    } = this.props;
    let fieldValues = { bandId: "", stageId: "", isCancelled: false };
    const validationSchemaObj = Object.assign({}, validationSchemaCommonObj);
    // console.log("bandsPicker=" + JSON.stringify(bandsPicker, null, 4));
    if (isEditExisting) {
      // console.log("schedule form edit mode, id=" + match.params.id);
      const matchingInfo = getAppearanceInfoForId(match.params.id);
      // console.log(
      //   "schedule form edit mode, matchingInfo=" +
      //     JSON.stringify(matchingInfo, null, 2)
      // );

      if (matchingInfo) {
        // console.log("matchingInfo.dateTimeStart=" + matchingInfo.dateTimeStart);
        // console.log("matchingInfo.dateTimeEnd=" + matchingInfo.dateTimeEnd);

        // incoming
        fieldValues = {
          bandId: matchingInfo.bandId,
          stageId: matchingInfo.stageId,
          isCancelled: matchingInfo.isCancelled,
          dateDay: dateFnsFormat(matchingInfo.dateTimeStart, "YYYY-MM-DD"),
          id: matchingInfo.id
        };
        const timeStart = new Date(matchingInfo.dateTimeStart);
        const timeEnd = new Date(matchingInfo.dateTimeEnd);
        fieldValues.timeStartString = dateFnsFormat(timeStart, "HH:mm");
        fieldValues.timeEndString = dateFnsFormat(timeEnd, "HH:mm");
        // console.log("timeStart=" + timeStart);
        // console.log("timeEnd=" + timeEnd);
        // console.log("timeStart isNaN getTime = " + isNaN(timeStart.getTime()));
        // console.log("timeEnd isNaN getTime =" + isNaN(timeEnd.getTime()));
        fieldValues.timeStart = isNaN(timeStart.getTime())
          ? new Date()
          : timeStart;
        fieldValues.timeEnd = isNaN(timeEnd.getTime()) ? new Date() : timeEnd;
        // console.log("Final fieldValues=" + JSON.stringify(fieldValues, null, 2));
      }
    } else {
      // validationSchemaObj.id = yup
      //   .string()
      //   .required()
    }

    const isRedirectOn = !isEditExisting && saveStatus === "success";
    return isRedirectOn ? (
      <Redirect to={`/scheduleform/${this.classId}`} />
    ) : (
      <div style={{ maxWidth: 320, marginBottom: 50 }}>
        {!isLoggedIn && <NotLoggedInWarning />}
        <h1>{isEditExisting ? "Edit" : "Add"} Appearance</h1>
        <LoadStatusIndicator
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <SaveStatusIndicator saveStatus={saveStatus} saveError={saveError} />
        <Formik
          enableReinitialize
          initialValues={Object.assign({}, fieldValues)}
          validationSchema={yup.object().shape(validationSchemaObj)}
          onSubmit={(values, actions) => {
            console.log("onSubmit values=" + JSON.stringify(values, null, 2));
            // Outgoing
            const processedValues = {
              stageId: values.stageId,
              bandId: values.bandId,
              isCancelled: values.isCancelled,
              dateTimeStart: `${values.dateDay}T${values.timeStartString}`,
              dateTimeEnd: `${values.dateDay}T${values.timeEndString}`
            };
            console.log("onSubmit processedValues=" + JSON.stringify(processedValues, null, 2));

            // Add ID only if it's a new appearance.  Assume that we won't be
            // able to change the bandId when editing later.
            if (isEditExisting) {
              processedValues.id = values.id;
            } else {
              processedValues.id = `${
                processedValues.bandId
              }~${shortId.generate()}`;
              this.classId = processedValues.id;
            }
            // console.log(
            //   "onSubmit processedValues=" +
            //     JSON.stringify(processedValues, null, 2)
            // );
            notifyInfo("Submitting appearance data to server...");

            submitDataToServer(processedValues);
            actions.setSubmitting(false);
          }}
          render={props => {
            const {
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue
            } = props;

            // console.log(
            //   "Appearances form, values=" + JSON.stringify(values, null, 2)
            // );
            return (
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="bandId">Band</Label>
                  <Input
                    type="select"
                    name="bandId"
                    disabled={isEditExisting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bandId}
                  >
                    <option />
                    {renderOptionsField(bandsPicker)}
                  </Input>
                  {errors.bandId && <div>{errors.bandId}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="stageId">Stage</Label>
                  <Input
                    type="select"
                    name="stageId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.stageId}
                  >
                    <option />
                    {renderOptionsField(stagesPicker)}
                  </Input>
                  {errors.stageId && <div>{errors.stageId}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="dateTimeStart">Day</Label>
                  <SelectList
                    name="dateDay"
                    onChange={value =>
                      setFieldValue("dateDay", value.valueField)
                    }
                    data={renderSelectDates(datesList)}
                    textField="textField"
                    valueField="valueField"
                    value={values.dateDay}
                  />
                  {errors.dateDay && <div>{errors.dateDay}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="timeStart">Start Time</Label>
                  <DateTimePicker
                    name="timeStart"
                    defaultValue={
                      isEditExisting ? values.timeStart : new Date()
                    }
                    date={false}
                    culture="en-GB"
                    format={timeFormatString}
                    step={30}
                    onChange={value => {
                      // console.log("onChange value = " + value);
                      // console.log(
                      //   "onChange string = " + dateFnsFormat(value, timeFormatString)
                      // );
                      setFieldValue("timeStart", value);
                      setFieldValue(
                        "timeStartString",
                        dateFnsFormat(value, timeFormatString)
                      );
                    }}
                    value={values.timeStart}
                  />
                  {errors.timeStart && <div>{errors.timeStart}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="timeEnd">End Time</Label>
                  <DateTimePicker
                    name="timeEnd"
                    defaultValue={
                      isEditExisting ? values.timeStart : new Date()
                    }
                    date={false}
                    culture="en-GB"
                    step={30}
                    format={timeFormatString}
                    onChange={value => {
                      // console.log("onChange value = " + value);
                      // console.log(
                      //   "onChange string = " + dateFnsFormat(value, timeFormatString)
                      // );
                      setFieldValue("timeEnd", value);
                      setFieldValue(
                        "timeEndString",
                        dateFnsFormat(value, timeFormatString)
                      );
                    }}
                    value={values.timeEnd}
                  />
                  {errors.timeEnd && <div>{errors.timeEnd}</div>}
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      name="isCancelled"
                      type="checkbox"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isCancelled}
                    />
                    Appearance cancelled
                  </Label>
                </FormGroup>

                <Button type="submit" color="primary" style={{ marginTop: 10 }}>
                  Save
                </Button>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

AppearanceForm.propTypes = {
  errors: PropTypes.object,
  fetchError: PropTypes.string.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  getAppearanceInfoForId: PropTypes.func,
  isEditExisting: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  match: PropTypes.object,
  notifyInfo: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  saveStatus: PropTypes.string,
  saveError: PropTypes.object,
  saveAppearanceClear: PropTypes.func,
  setFieldValue: PropTypes.func,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default AppearanceForm;
