// Render Prop
import React from "react";
import PropTypes from "prop-types";
import yup from "yup";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Formik } from "formik";

import {
  LoadStatusIndicator,
  SaveStatusIndicator
} from "./loadsaveindicator.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";

import {
  formFieldsWrapperStyles,
  helpInfoTextStyles,
  blurbFieldRows
} from "./formstyles.js";

const ContactUsForm = ({
  startBlurb = "",
  email1 = "",
  email2 = "",
  mobile = "",
  gettingThereBlurb = "",
  locationBlurb = "",
  helstonburyWebUrl = "",
  helstonburyFBID = "",
  helstonburyMerchandiseFBID = "",
  helstonburyMerchandiseFBText = "",
  mapLinkText = "",
  notifyInfo = "",
  venueAddress = "",
  venuePhone = "",
  venueEmail = "",
  isLoggedIn = "",
  appTips = "",
  submitDataToServer,
  saveStatus = "",
  saveError = ""
}) => {
  console.log("contactUs form");
  const fieldValues = {
    startBlurb,
    email1,
    email2,
    mobile,
    gettingThereBlurb,
    locationBlurb,
    helstonburyFBID,
    helstonburyWebUrl,
    helstonburyMerchandiseFBID,
    helstonburyMerchandiseFBText,
    mapLinkText,
    venueAddress,
    venuePhone,
    venueEmail,
    appTips
  };
  // console.log("fieldValues:");
  // console.log(fieldValues);
  const validationSchemaObj = {
    startBlurb: yup.string().required(),
    email1: yup.string().email(),
    email2: yup.string().email()
  };

  return (
    <div style={formFieldsWrapperStyles}>
      {!isLoggedIn && <NotLoggedInWarning />}
      <h1>Edit Contact Us Page Info</h1>
      Loading status: {saveStatus}
      {saveStatus === "saving" && (
        <i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }} />
      )}
      <br />
      {saveStatus === "failure" &&
        `Error: ${JSON.stringify(saveError, null, 4)}`}
      <Formik
        enableReinitialize
        initialValues={Object.assign({}, fieldValues)}
        validationSchema={yup.object().shape(validationSchemaObj)}
        onSubmit={(values, actions) => {
          // console.log("ContactUs form data");
          // console.log(values);
          notifyInfo("Submitting contacts data to server...");
          submitDataToServer(values);
          actions.setSubmitting(false);
        }}
        render={props => {
          const {
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
              <FormGroup>
                <Label for="startBlurb">Start Blurb</Label>
                <Input
                  rows={6}
                  type="textarea"
                  name="startBlurb"
                  placeholder="Introductory text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.startBlurb}
                />
                {errors.startBlurb && <div>{errors.startBlurb}</div>}
              </FormGroup>

              <h3>Organiser Details</h3>
              <FormGroup>
                <Label for="email1">Email 1:</Label>
                <Input
                  type="text"
                  name="email1"
                  placeholder="Main email address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email1}
                />
                <Label for="email2">Email 2:</Label>
                <Input
                  rows={6}
                  type="text"
                  name="email2"
                  placeholder="Alternative email address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email2}
                />
                <Label for="mobile">Mobile:</Label>
                <Input
                  type="text"
                  name="mobile"
                  placeholder="Contact mobile number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mobile}
                />
                <Label for="helstonburyWebUrl">Web URL:</Label>
                <Input
                  type="text"
                  name="helstonburyWebUrl"
                  placeholder="Helstonbury Web URL"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.helstonburyWebUrl}
                />
                <Label for="helstonburyFBID">Facebook Page ID:</Label>
                <Input
                  type="text"
                  name="helstonburyFBID"
                  placeholder="Helstonbury Facebook Page ID"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.helstonburyFBID}
                />
                <Label for="helstonburyMerchandiseFBID">
                  Merchandise Facebook Post ID:
                </Label>
                <Input
                  type="text"
                  name="helstonburyMerchandiseFBID"
                  placeholder="ID for Facebook Merchandise post"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.helstonburyMerchandiseFBID}
                />
                <Label for="helstonburyMerchandiseFBText">
                  Merchandise Facebook Post Text:
                </Label>
                <Input
                  type="text"
                  name="helstonburyMerchandiseFBText"
                  placeholder="Text for link to FB Merchandise post"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.helstonburyMerchandiseFBText}
                />
              </FormGroup>

              <FormGroup>
                <Label for="locationBlurb">Location blurb:</Label>
                <Input
                  rows={6}
                  type="textarea"
                  name="locationBlurb"
                  placeholder="Introductory location blurb"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.locationBlurb}
                />
              </FormGroup>
              <FormGroup>
                <Label for="venueAddress">Venue address:</Label>
                <Input
                  rows={6}
                  type="textarea"
                  name="venueAddress"
                  placeholder="Venue address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.venueAddress}
                />
                <Label for="venuePhone">Venue phone:</Label>
                <Input
                  type="text"
                  name="venuePhone"
                  placeholder="Venue phone number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.venuePhone}
                />
                <Label for="venueEmail">Venue email:</Label>
                <Input
                  type="text"
                  name="venueEmail"
                  placeholder="Venue email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.venueEmail}
                />
              </FormGroup>
              <FormGroup>
                <Label for="gettingThereBlurb">Getting there blurb:</Label>
                <Input
                  rows={6}
                  type="textarea"
                  name="gettingThereBlurb"
                  placeholder="Some blurb about how to get to Helston"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.gettingThereBlurb}
                />
              </FormGroup>
              <h3>App Stuff</h3>
              <FormGroup>
                <Label for="appTips">Tips & Tricks</Label>
                <Input
                  rows={10}
                  type="textarea"
                  name="appTips"
                  placeholder="Some blurb about how to use the app"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.appTips}
                />
              </FormGroup>
              <Button type="submit" color="primary">Save</Button>
            </form>
          );
        }}
      />
    </div>
  );
};

ContactUsForm.propTypes = {
  errors: PropTypes.object,
  isEditExisting: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  // startBlurb: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  notifyInfo: PropTypes.func.isRequired,
  saveStatus: PropTypes.string,
  saveError: PropTypes.object,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object,
  startBlurb: PropTypes.string.isRequired,
  email1: PropTypes.string.isRequired,
  email2: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  gettingThereBlurb: PropTypes.string.isRequired,
  locationBlurb: PropTypes.string.isRequired,
  helstonburyWebUrl: PropTypes.string.isRequired,
  helstonburyFBID: PropTypes.string.isRequired,
  helstonburyMerchandiseFBID: PropTypes.string.isRequired,
  helstonburyMerchandiseFBText: PropTypes.string.isRequired,
  mapLinkText: PropTypes.string.isRequired,
  venueAddress: PropTypes.string.isRequired,
  venuePhone: PropTypes.string.isRequired,
  venueEmail: PropTypes.string.isRequired,
  appTips: PropTypes.string.isRequired
};

export default ContactUsForm;

/*
              <FormGroup>
                <Label for="endBlurb">End Blurb</Label>
                <Input
                  rows={6}
                  type="textarea"
                  name="endBlurb"
                  placeholder="ContactUs page information"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.endBlurb}
                />
                {errors.endBlurb && <div>{errors.endBlurb}</div>}
              </FormGroup>
*/
