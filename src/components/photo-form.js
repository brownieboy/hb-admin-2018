import React, { Component } from "react";
import { Redirect } from "react-router";
import { Formik } from "formik";
import shortId from "shortid";
import * as yup from "yup";
import PropTypes from "prop-types";
import { Button, FormGroup, Label, Input } from "reactstrap";
import qs from "qs";

import NotLoggedInWarning from "../components/not-logged-in-warning.js";
import { getPhotoStoragePath } from "../constants/firebasePaths.js";
import { CardImage, ThumbImage } from "./photo-display.js";
import UploadProgressBar from "./uploadprogressbar.js";

import {
  formFieldsWrapperStyles
  // helpInfoTextStyles,
  // blurbFieldRows
} from "./formstyles.js";

const renderOptionsField = dataArray =>
  dataArray.map(dataMember => (
    <option key={dataMember.id} value={dataMember.id}>
      {dataMember.name}
    </option>
  ));

class PhotoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInfo: {},
      postFileName: ""
    };
  }

  classId = "";

  handleFileChange = event => {
    // console.log("handleThumbFileChange");
    // console.log(event.target.files[0]);
    this.setState({ fileInfo: event.target.files[0] });
  };

  handleFileUpload = (values, matchingPhotoInfo) => {
    const storageData = {
      id: values.id,
      type: values.type,
      photoType: values.photoType,
      assocEntityName: matchingPhotoInfo
        ? matchingPhotoInfo.assocEntityName
        : "????",
      fileInfo: this.state.fileInfo,
      storagePath: getPhotoStoragePath(values.type, values.photoType)
    };
    // console.log("PhotoForm..handleFileUpload, storageData:");
    // console.log(storageData);

    // Triggers START_PHOTO_FILE_UPLOAD, monitored by uploadFirebaseImagesSagas.js
    this.props.sendStorageStart(storageData);
  };

  // componentWillUnmount() {
  //   // console.log("Clearing from componentWillUnmount");
  //   if (this.props.saveBandClear) {
  //     this.props.saveBandClear(); // Clear saveSuccess status so we don't loop
  //   }
  // }

  render() {
    const {
      notifyInfo,
      getPhotoInfoForId,
      isEditExisting,
      isLoggedIn,
      match,
      submitDataToServer,
      saveStatus,
      // sendStorageStart,
      // photoProgress = 0,
      photoStorageUpdatesList,
      bandsPicker,
      stagesPicker
      // saveBandClear
    } = this.props;

    console.log("PhotoForm..render(), props:");
    console.log(this.props);

    // if(photoStorageUpdatesList.findin)
    const { fileInfo } = this.state;

    let fieldValues = {
      fileName: "unknown",
      id: "",
      fullUrl: ""
    };

    let matchingPhotoInfo,
      photoProgress = 0,
      matchingPhotoStorageUpdate;
    if (isEditExisting) {
      console.log("parsed is");
      console.log(qs.parse(match.params.id));
      matchingPhotoInfo = getPhotoInfoForId(match.params.id);
      if (matchingPhotoInfo) {
        fieldValues = { fullUrl: "", ...matchingPhotoInfo };
      }

      matchingPhotoStorageUpdate = photoStorageUpdatesList.find(
        memberObj => memberObj.updateId === fieldValues.id
      );
      if (matchingPhotoStorageUpdate) {
        photoProgress = matchingPhotoStorageUpdate.photoProgress;
      }
    }

    // console.log("fieldValues:");
    // console.log(fieldValues);
    const validationSchemaObj = {
      assocEntityId: yup.string().required(),
      type: yup.string().required(),
      photoType: yup.string().required()
    };

    const isRedirectOn = !isEditExisting && saveStatus === "success";

    return isRedirectOn ? (
      <Redirect to={`/photoform/${this.classId}`} />
    ) : (
      <div style={formFieldsWrapperStyles}>
        {!isLoggedIn && <NotLoggedInWarning />}
        <h1>{isEditExisting ? "Edit Photo" : "Add New Photo"}</h1>
        <Formik
          enableReinitialize
          initialValues={Object.assign({}, fieldValues)}
          validationSchema={yup.object().shape(validationSchemaObj)}
          onSubmit={(values, actions) => {
            if (!isEditExisting) {
              this.classId = `img-${shortId.generate()}`;
              values.id = this.classId;
            }
            if (fileInfo.name) {
              values.fileName = fileInfo.name;
            }
            // console.log("onSubmit photo values:");
            // console.log(values);
            notifyInfo("Submitting photo data to server...");

            submitDataToServer(values); // saveEditedPhoto from photosReducer
            actions.setSubmitting(false);
          }}
          render={props => {
            const {
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit
              // submitForm
            } = props;

            // radio inputs from https://github.com/jaredpalmer/formik/issues/116
            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label check htmlFor="typeBand">
                      <input
                        name="type"
                        id="typeBand"
                        disabled={isEditExisting}
                        type="radio"
                        value="band"
                        checked={values.type === "band"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />{" "}
                      Band
                    </Label>
                    <Label
                      check
                      htmlFor="typeStage"
                      style={{ marginLeft: "10px" }}
                    >
                      <input
                        name="type"
                        id="typeStage"
                        type="radio"
                        disabled={isEditExisting}
                        value="stage"
                        checked={values.type === "stage"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />{" "}
                      Stage
                    </Label>
                    {errors.type && <div>{errors.type}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="select"
                      name="assocEntityId"
                      disabled={isEditExisting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.assocEntityId}
                    >
                      <option />
                      {renderOptionsField(
                        values.type === "band"
                          ? bandsPicker
                          : values.type === "stage"
                          ? stagesPicker
                          : []
                      )}
                    </Input>
                    {errors.assocEntityId && <div>{errors.assocEntityId}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label check htmlFor="photoTypeCard">
                      <input
                        name="photoType"
                        id="photoTypeCard"
                        type="radio"
                        value="card"
                        checked={values.photoType === "card"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />{" "}
                      Card
                    </Label>
                    <Label
                      check
                      htmlFor="photoTypeThumb"
                      style={{ marginLeft: "10px" }}
                    >
                      <input
                        name="photoType"
                        id="photoTypeThumb"
                        type="radio"
                        value="thumb"
                        checked={values.photoType === "thumb"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />{" "}
                      Thumb
                    </Label>
                    {errors.photoType && <div>{errors.photoType}</div>}
                  </FormGroup>

                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </form>
                <hr />
                {!isEditExisting && (
                  <div>
                    You must save this form at least once before you can add
                    images.
                  </div>
                )}
                <div>Filename: {values.fileName}</div>
                <div style={{ display: "none" }}>Url: {values.fullUrl}</div>
                <div style={{ marginTop: "10px" }}>
                  {values.photoType === "thumb" ? (
                    <ThumbImage url={values.fullUrl} />
                  ) : (
                    <CardImage url={values.fullUrl} />
                  )}
                </div>
                <div
                  name="imagesWrapper"
                  style={{ marginBottom: 100, marginTop: 40 }}
                >
                  <div name="imagesLeftWrapper">
                    <div>
                      <input
                        type="file"
                        disabled={!isEditExisting}
                        name="photoInput"
                        onChange={this.handleFileChange}
                      />
                    </div>
                    <button
                      disabled={!this.state.fileInfo.name}
                      onClick={() =>
                        this.handleFileUpload(values, matchingPhotoInfo)
                      }
                      style={{ marginTop: 10 }}
                    >
                      Upload photo
                    </button>
                    <div
                      style={{
                        maxWidth: 200,
                        display: this.state.fileInfo.name ? "block" : "none"
                      }}
                    >
                      <UploadProgressBar photoProgress={photoProgress} />
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

/*
https://findmyfbid.com/, https://findmyfbid.com/
*/

PhotoForm.propTypes = {
  bandsPicker: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  stagesPicker: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  errors: PropTypes.object,
  history: PropTypes.object.isRequired, // from react-router
  getPhotoInfoForId: PropTypes.func.isRequired,
  isEditExisting: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  match: PropTypes.object,
  notifyInfo: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  photoStorageUpdatesList: PropTypes.arrayOf(PropTypes.object.isRequired)
    .isRequired,
  saveStatus: PropTypes.string,
  saveError: PropTypes.object,
  sendStorageStart: PropTypes.func,
  // photoProgress: PropTypes.number,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default PhotoForm;
