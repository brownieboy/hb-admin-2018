// Render Prop
import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Formik } from "formik";

// import {
//   LoadStatusIndicator,
//   SaveStatusIndicator
// } from "./loadsaveindicator.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";

const HomeForm = ({
  homeText,
  isLoggedIn,
  notifyInfo,
  submitDataToServer,
  saveStatus,
  saveError
}) => {
  const fieldValues = { homeText };
  // console.log("fieldValues:");
  // console.log(fieldValues);
  const validationSchemaObj = { homeText: yup.string().required() };

  return (
    <div>
      {!isLoggedIn && <NotLoggedInWarning />}
      <h1>Edit Home Page Info</h1>
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
          // console.log(JSON.stringify(values, null, 2));
          notifyInfo("Submitting home page data to server...");
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
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="homeText">Info</Label>
                <Input
                  rows={12}
                  type="textarea"
                  name="homeText"
                  placeholder="Home page information"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.homeText}
                />
                {errors.homeText && <div>{errors.homeText}</div>}
              </FormGroup>
              <Button color="primary" type="submit">Save</Button>
            </form>
          );
        }}
      />
    </div>
  );
};

/*

      <Formik
        enableReinitialize
        initialValues={Object.assign({}, fieldValues)}
        validationSchema={yup.object().shape(validationSchemaObj)}
        onSubmit={(values, actions) => {
          console.log(JSON.stringify(values, null, 2));
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
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="homeText">Stage ID</Label>
                <Input
                  disabled={isEditExisting}
                  type="text"
                  name="homeText"
                  placeholder="ID must be unique"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.homeText}
                />
                {errors.homeText && <div>{errors.homeText}</div>}
              </FormGroup>
              <Button type="submit">Save</Button>
            </form>
          );
        }}
      />

 */

HomeForm.propTypes = {
  errors: PropTypes.object,
  isEditExisting: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  homeText: PropTypes.string.isRequired,
  notifyInfo: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  saveStatus: PropTypes.string,
  saveError: PropTypes.object,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default HomeForm;
