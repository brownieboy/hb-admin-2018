// Render Prop
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, FormGroup, Label } from "reactstrap";
// import { format as dateFnsFormat } from "date-fns";
// import enGB from "date-fns/locale/en-GB";
// import dateFnsLocalizer from "react-widgets-date-fns";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import "react-widgets/dist/css/react-widgets.css";
import { dateFormatString } from "../constants/formats.js";
import {
  LoadStatusIndicator,
  SaveStatusIndicator
} from "./loadsaveindicator.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";

import ConfirmModal from "../components/confirm-modal.js";

import {
  fnsDatesToISOText,
  textDatesToFnsDates
} from "../helper-functions/dateFNS.js";

// const formats = Object.assign(defaultFormats, { default: "DD/MM/YYYY" });
// dateFnsLocalizer(formats, { "en-GB": enGB });
// dateFnsLocalizer({ "en-GB": enGB });
// dateFnsLocalizer({ locales: { "en-GB": enGB } });

/* eslint react/no-deprecated: 0 */
class DatesForm extends Component {
  constructor(props) {
    super(props);
    const { datesList, thisYear } = props;
    // console.log("datesList=" + JSON.stringify(datesList, null, 4));
    console.log("thisYear");
    console.log(thisYear);
    this.state = {
      datesList: textDatesToFnsDates(datesList),
      showConfirmDeleteModal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(
    //   "date-form.js componentWillReceiveProps, nextProps=" +
    //     JSON.stringify(nextProps, null, 4)
    // );
    if (nextProps.datesList) {
      this.setState({
        datesList: textDatesToFnsDates(nextProps.datesList)
      });
    }
  }

  // textDatesToFnsDates = textDateList =>
  //   textDateList.map(textDate => {
  //     const newDate = new Date(textDate);
  //     return newDate;
  //   });

  // fnsDatesToISOText = dateList => {
  //   // console.log("fnsDatesToISOText, dateFnsFormat=" + dateFnsFormat);
  //   return dateList.map(dateMember => dateFnsFormat(dateMember, "YYYY-MM-DD"));
  // };

  handleChange = fieldData => {
    // console.log("fieldData = " + JSON.stringify(fieldData, null, 4));
    const { datesList } = this.state;

    const newDatesList = [
      ...datesList.slice(0, fieldData.fieldNo),
      new Date(fieldData.value),
      ...datesList.slice(fieldData.fieldNo + 1)
    ];
    this.setState({ datesList: newDatesList });
  };

  handleSubmit = e => {
    const { notifyInfo, submitDataToServer } = this.props;
    e.preventDefault();
    const values = fnsDatesToISOText(this.state.datesList);
    // console.log(
    //   "submitting dates to server = " + JSON.stringify(values, null, 2)
    // );
    notifyInfo("Submitting dates data to server...");
    submitDataToServer(values);
    // actions.setSubmitting(false);
  };

  deleteDate = fieldNo => {
    const { datesList } = this.state;
    const newDates = [
      ...datesList.slice(0, fieldNo),
      ...datesList.slice(fieldNo + 1)
    ];
    this.setState({ datesList: newDates, showConfirmDeleteModal: false });
  };

  handleDeleteDate = fieldNo => {
    this.setState({
      dateFieldNoToDelete: fieldNo,
      showConfirmDeleteModal: true
    });
  };

  getDateField = (dateValue, fieldNo) => {
    const keyName = `date${fieldNo}`;
    return (
      <FormGroup key={keyName}>
        <Label for={keyName}>Day {fieldNo + 1}</Label>
        <div style={{ display: "flex", alignItems: "center", width: "260px" }}>
          <DateTimePicker
            name={keyName}
            format={dateFormatString}
            time={false}
            onChange={value => this.handleChange({ value, fieldNo })}
            value={dateValue}
          />
          <i
            className="icon-trash"
            onClick={() => {
              this.handleDeleteDate(fieldNo);
            }}
            style={{ marginLeft: "20px" }}
          />
        </div>
      </FormGroup>
    );
  };

  getDateFields = datesList => {
    // console.log("getDateFields, datesList:");
    // console.log(datesList);
    let x = -1;
    return datesList.map(theDate => {
      x++;
      return this.getDateField(theDate, x);
    });
  };

  render() {
    const {
      // isEditExisting,
      isLoggedIn,
      // match,
      // notifyInfo,
      // submitDataToServer,
      fetchStatus,
      fetchError,
      saveStatus,
      saveError
    } = this.props;

    const { datesList } = this.state;

    // let fieldValues = { dayOne: "", dayTwo: "", dayThree: "" };
    return (
      <div>
        {!isLoggedIn && <NotLoggedInWarning />}
        <h1>Helstonbury Dates</h1>
        <div style={{ maxWidth: 180 }}>
          <LoadStatusIndicator
            fetchStatus={fetchStatus}
            fetchError={fetchError}
          />
          <SaveStatusIndicator saveStatus={saveStatus} saveError={saveError} />

          <form onSubmit={this.handleSubmit}>
            {this.getDateFields(datesList)}
            <div style={{ display: "flex" }}>
              <Button color="primary" type="submit">
                Save
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  const newDates = [...datesList, new Date()];
                  this.setState({ datesList: newDates });
                }}
                style={{ marginLeft: 10 }}
              >
                Add new date
              </Button>
            </div>
          </form>
        </div>

        <ConfirmModal
          displayModal={this.state.showConfirmDeleteModal}
          modalTitle="Delete Date?"
          modalBody={`Are you sure that you want to delete date number ${this
            .state.dateFieldNoToDelete + 1}?`}
          handleOk={() => {
            this.deleteDate(this.state.dateFieldNoToDelete);
          }}
          handleCancel={() => this.setState({ showConfirmDeleteModal: false })}
        />
      </div>
    );
  }
}

DatesForm.propTypes = {
  datesList: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  ).isRequired,
  errors: PropTypes.object,
  fetchError: PropTypes.string.isRequired,
  fetchStatus: PropTypes.string.isRequired,
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
  saveError: PropTypes.string,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default DatesForm;
