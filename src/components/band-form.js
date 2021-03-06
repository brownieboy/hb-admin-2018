import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import { Button, FormGroup, Label, Input } from "reactstrap";
import shortId from "shortid";

import { OptionsForArray } from "../helper-functions/field-helpers.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";

import { CardImage, ThumbImage } from "./photo-display.js";
import ConfirmModal from "./confirm-modal.js";
import ImageUploaderConn from "../containers/imageuploader-conn.js";
import { getPhotoStoragePath } from "../constants/firebasePaths.js";

import {
  formFieldsWrapperStyles,
  helpInfoTextStyles,
  blurbFieldRows
} from "./formstyles.js";

const validationSchemaCommonObj = {
  name: yup.string().required(),
  summary: yup.string().required(),
  facebookPageUrl: yup.string(),
  facebookId: yup.string().when("facebookPageUrl", {
    is: val => (val ? val !== "" : false),
    then: yup
      .string()
      .required(
        "If entering a Facebook page URL, you must also supply that page's ID"
      )
  }),
  facebookPageName: yup.string().when("facebookPageUrl", {
    is: val => (val ? val !== "" : false),
    then: yup
      .string()
      .required(
        "If entering a Facebook page URL, you must also supply that page's Name.  (Just put in the band's name otherwise.)"
      )
  })
};

class BandForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbPhotoInfo: {},
      cardPhotoInfo: {},
      thumbStorageFileInfo: {},
      cardStorageFileInfo: {},
      thumbModalCancelButtonLabel: "Cancel",
      cardModalCancelButtonLabel: "Cancel"
    };
    this.linkWrapperRef = React.createRef();
  }

  classId = "";

  handleFileChange = (photoType, fileInfo) => {
    const newPhotoInfo = {
      ...this.state[`${photoType}PhotoInfo`],
      fileName: fileInfo.name
    };
    this.setState({
      [`${photoType}StorageFileInfo`]: fileInfo,
      [`${photoType}PhotoInfo`]: newPhotoInfo
    });
  };

  handleFileUpload = (photoType, caption = "") => {
    // Note: the new photo boject created in handleNewImageClick has not
    // been saved to Redux Store at this point.  So we need to that and
    // then actually upload the image to Storage.
    // console.log("BandForm..handleFileUpload");
    const { saveNewPhotoAndUploadProcess } = this.props;
    const photoInfo = { ...this.state[`${photoType}PhotoInfo`], caption };
    const storageFileInfo = {
      ...this.state[`${photoType}PhotoInfo`],
      fileInfo: this.state[`${photoType}StorageFileInfo`],
      storagePath: getPhotoStoragePath("band", photoType)
    };
    // Triggers savePhotoInfoAndUploadsaga watche din writeFirebasePhotoSagas.js
    saveNewPhotoAndUploadProcess(photoInfo, storageFileInfo, {});
    // this.setState({ [`${photoType}ModalCancelButtonLabel`]: "Close" });
  };

  handleNewImageClick = (photoType, values) => {
    // Create new image object and pass it down to the modal.  There is
    // no need to save it to Redux Store, let alone the server, at this point.
    // const { saveNewPhoto } = this.props;
    console.log("handNewImageClick");
    // console.log(values);
    const newPhotoId = `img-${shortId.generate()}`;

    const newPhotoObj = {
      id: newPhotoId,
      assocEntityId: values.id,
      fileName: "unknown",
      fullUrl: "",
      type: "band",
      photoType
    };
    // const domUrl = this.linkWrapperRef.current
    //   .getElementsByTagName("a")[0]
    // .getAttribute("href");
    //  saveNewPhotoAndOpenInNewUI(newPhotoObj, domUrl);
    //  saveNewPhoto(newPhotoObj);
    // this.setState({ [`newPhoto${photoType}Id`]: newPhotoId });
    // Dynamic property name assignment
    this.setState({ [`${photoType}PhotoInfo`]: newPhotoObj });
  };

  componentWillUnmount() {
    // console.log("band Form Clearing from componentWillUnmount");
    if (this.props.saveBandClear) {
      this.props.saveBandClear(); // Clear saveSuccess status so we don't loop
    }
  }

  render() {
    const {
      notifyInfo,
      getBandInfoForId,
      getAppearancesForBandId,
      selectCardPhotosForBand,
      selectThumbPhotosForBand,
      isEditExisting,
      isLoggedIn,
      match,
      submitDataToServer,
      saveStatus,
      thisYear,
      yearsAvailable
      // saveBandClear
    } = this.props;

    const {
      thumbPhotoInfo,
      cardPhotoInfo,
      // thumbStorageFileInfo,
      // cardStorageFileInfo,
      cardModalCancelButtonLabel,
      thumbModalCancelButtonLabel
    } = this.state;

    let fieldValues;
    const defaultFieldValues = {
      name: "",
      id: "",
      summary: "",
      caption: "",
      blurb: "",
      facebookPageUrl: "",
      facebookId: "",
      facebookPageName: "",
      yearsAppearing: [thisYear], // for new bands, automatically enroll them in current festival
      thumbPhotoId: "",
      cardPhotoId: ""
    };

    const validationSchemaObj = Object.assign({}, validationSchemaCommonObj);
    let matchingInfo,
      matchingCardPhotosArray = [],
      matchingThumbPhotosArray = [];
    if (isEditExisting) {
      matchingInfo = getBandInfoForId(match.params.id);
      // console.log("band form matchingInfo");
      // console.log(matchingInfo);
      // const mergedFieldValues = { ...fieldValues, ...matchingInfo };
      // console.log("mergedFieldValues");
      // console.log(mergedFieldValues);

      if (matchingInfo) {
        // fieldValues = Object.assign({ yearsAppearing: [] }, matchingInfo);
        fieldValues = { ...defaultFieldValues, ...matchingInfo };

        // if (typeof fieldValues.yearsAppearing === "undefined") {
        //   fieldValues.yearsAppearing = []; // Late addition
        // }
        // console.log("fieldValues:");
        // console.log(fieldValues);
        validationSchemaObj.yearsAppearing = yup
          .array()
          .test(
            "yearsAppearing",
            `Band has an appearance for ${thisYear}.  You must delete that before removing this band from the ${thisYear} line up.`,
            yearsArray => {
              // console.log("inside yearsAppearing, yearsArray:");
              // console.log(yearsArray);

              let returnVal = true;
              if (!yearsArray.includes(thisYear)) {
                const appearancesForBand = getAppearancesForBandId(
                  fieldValues.id
                );
                const numberOfAppearances =
                  typeof appearancesForBand === "object"
                    ? appearancesForBand.length
                    : 0;
                returnVal = numberOfAppearances <= 0;
              }
              return returnVal;
            }
          );
        matchingCardPhotosArray = selectCardPhotosForBand(match.params.id);
        matchingThumbPhotosArray = selectThumbPhotosForBand(match.params.id);
      } else {
        // No matchingInfoFound
        fieldValues = { ...defaultFieldValues };
      }
    } else {
      // Not edting an existing one.
      fieldValues = { ...defaultFieldValues };
      validationSchemaObj.id = yup
        .string()
        .required()
        .test(
          "id",
          "There is already a band with the same id",
          id => !getBandInfoForId(id)
        );
    }

    const isRedirectOn = !isEditExisting && saveStatus === "success";

    return isRedirectOn ? (
      <Redirect to={`/bandform/${this.classId}`} />
    ) : (
      <div style={formFieldsWrapperStyles}>
        {!isLoggedIn && <NotLoggedInWarning />}
        <h1>
          {isEditExisting
            ? `Edit ${matchingInfo ? matchingInfo.name : "??"}`
            : "Add Band"}
        </h1>
        <Formik
          enableReinitialize
          initialValues={Object.assign({}, fieldValues)}
          validationSchema={yup.object().shape(validationSchemaObj)}
          onSubmit={(values, actions) => {
            // console.log("onSubmit band values:");
            // console.log(values);
            notifyInfo("Submitting band data to server...");
            // caption part of photo data, not band, so we need to remove it
            // from our submitted object.
            const { caption, ...remainderObj } = values; // eslint-disable-line no-unused-vars
            submitDataToServer(remainderObj);
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
              <div>
                <form onSubmit={handleSubmit}>
                  Festivals appearing/appeared at:
                  <br />
                  <FieldArray
                    name="yearsAppearing"
                    render={({ remove, push }) => (
                      <div>
                        {yearsAvailable.map(theYear => (
                          <div key={theYear}>
                            <Label>
                              <input
                                name="yearsAppearing"
                                type="checkbox"
                                value={theYear}
                                checked={values.yearsAppearing.includes(
                                  theYear
                                )}
                                onChange={e => {
                                  if (e.target.checked) {
                                    push(theYear);
                                  } else {
                                    remove(
                                      values.yearsAppearing.indexOf(theYear)
                                    );
                                  }
                                }}
                              />{" "}
                              {theYear}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  {errors.yearsAppearing && <div>{errors.yearsAppearing}</div>}
                  <FormGroup style={{ marginTop: "20px" }}>
                    <Label for="id">Band ID</Label>
                    <Input
                      disabled={isEditExisting}
                      type="text"
                      name="id"
                      placeholder="ID must be unique"
                      onChange={e => {
                        handleChange(e);
                        this.classId = e.target.value;
                      }}
                      onBlur={handleBlur}
                      value={values.id}
                    />
                    {errors.id && <div>{errors.id}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Band name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Band name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    {errors.name && <div>{errors.name}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="summary">Summary</Label>
                    <Input
                      type="text"
                      name="summary"
                      placeholder="One line summary, shown in app's bands list"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.summary}
                    />
                    {errors.summary && <div>{errors.summary}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="blurb">Band Info</Label>
                    <Input
                      rows={blurbFieldRows}
                      type="textarea"
                      name="blurb"
                      placeholder="Info about the band/artist"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.blurb}
                    />
                    {errors.blurb && <div>{errors.blurb}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="facebookPageUrl">Facebook Page URL</Label>
                    <Input
                      type="text"
                      name="facebookPageUrl"
                      placeholder="URL for band's Facebook page"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.facebookPageUrl}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="facebookId">Facebook Page ID</Label>
                    <Input
                      type="text"
                      name="facebookId"
                      placeholder="ID for band's Facebook page"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.facebookId}
                    />
                    {errors.facebookId && <div>{errors.facebookId}</div>}
                    <span style={helpInfoTextStyles}>
                      To get the page ID, paste FB page URL in at{" "}
                      <a
                        href="https://findmyfbid.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://findmyfbid.com/
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://lookup-id.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://lookup-id.com/
                      </a>
                    </span>
                  </FormGroup>
                  <FormGroup>
                    <Label for="facebookPageName">Facebook Page Name</Label>
                    <Input
                      type="text"
                      name="facebookPageName"
                      placeholder="Name for band's Facebook page"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.facebookPageName}
                    />
                    {errors.facebookPageName && (
                      <div>{errors.facebookPageName}</div>
                    )}
                  </FormGroup>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                  <hr />
                  <h2>Images</h2>
                  <div
                    name="imagesWrapper"
                    style={{ marginBottom: 100, marginTop: 10 }}
                  >
                    <Button
                      type="button"
                      onClick={() => this.handleNewImageClick("thumb", values)}
                    >
                      <i
                        className="fa fa-image fa-lg"
                        style={{ marginRight: "8px" }}
                      />
                      Create new thumbnail image
                    </Button>

                    <Input
                      type="select"
                      name="thumbPhotoId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.thumbPhotoId}
                    >
                      <option value="">Select thumbnail image</option>
                      <OptionsForArray
                        sourceArray={matchingThumbPhotosArray}
                        valuePropertyName="id"
                        displayPropertyName="fileName"
                      />
                    </Input>
                    <div
                      name="thumbImagesWrapper"
                      style={{
                        display: "flex",
                        marginBottom: 30,
                        marginTop: 10
                      }}
                    >
                      <div name="imagesLeftWrapper">
                        <Label for="thumbInput">Thumbnail image:</Label>
                      </div>
                      <div name="imagesRightWrapper">
                        <ThumbImage
                          url={(() => {
                            const matchingPhoto = matchingThumbPhotosArray.find(
                              photoMember =>
                                photoMember.id === values.thumbPhotoId
                            );
                            return matchingPhoto ? matchingPhoto.fullUrl : "";
                          })()}
                          round={true}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => this.handleNewImageClick("card", values)}
                    >
                      <i
                        className="fa fa-image fa-lg"
                        style={{ marginRight: "8px" }}
                      />
                      Create new card image
                    </Button>
                    <Input
                      type="select"
                      name="cardPhotoId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cardPhotoId}
                    >
                      <option value="">Select card image</option>
                      <OptionsForArray
                        sourceArray={matchingCardPhotosArray}
                        valuePropertyName="id"
                        displayPropertyName="fileName"
                      />
                    </Input>
                    <div
                      name="cardImagesWrapper"
                      style={{ display: "flex", marginTop: 10 }}
                    >
                      <div name="imagesLeftWrapper">
                        <Label for="cardInput">Card image:</Label>
                      </div>
                      <div name="imagesRightWrapper">
                        <CardImage
                          url={(() => {
                            const matchingPhoto = matchingCardPhotosArray.find(
                              photoMember =>
                                photoMember.id === values.cardPhotoId
                            );
                            return matchingPhoto ? matchingPhoto.fullUrl : "";
                          })()}
                        />
                      </div>
                    </div>
                  </div>
                </form>
                <ConfirmModal
                  displayModal={!!thumbPhotoInfo.fileName}
                  modalTitle="Upload Thumbnail Image"
                  cancelButtonLabel={thumbModalCancelButtonLabel}
                  handleCancel={() => {
                    this.setState({
                      thumbPhotoInfo: {},
                      thumbModalCancelButtonLabel: "Cancel"
                    });
                  }}
                >
                  <ImageUploaderConn
                    photoId={thumbPhotoInfo.id ? thumbPhotoInfo.id : ""}
                    inputDisabled={!isEditExisting}
                    handleFileUpload={() => this.handleFileUpload("thumb")}
                    handleFileChange={fileInfo =>
                      this.handleFileChange("thumb", fileInfo)
                    }
                    handleProgressReachedMax={() => {
                      this.setState({
                        thumbModalCancelButtonLabel: "Close"
                      });
                    }}
                    fileName={
                      thumbPhotoInfo.fileName
                        ? thumbPhotoInfo.fileName
                        : "unknown"
                    }
                  />
                </ConfirmModal>
                <ConfirmModal
                  displayModal={!!cardPhotoInfo.fileName}
                  modalTitle="Upload Card Image"
                  cancelButtonLabel={cardModalCancelButtonLabel}
                  handleCancel={() => {
                    this.setState({
                      cardPhotoInfo: {},
                      cardModalCancelButtonLabel: "Cancel"
                    });
                  }}
                >
                  <FormGroup>
                    <Label check htmlFor="caption">
                      Caption (optional):
                    </Label>
                    <Input
                      name="caption"
                      type="text"
                      placeholder="Will be displayed under photo in the app"
                      value={values.caption}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                  <ImageUploaderConn
                    photoId={cardPhotoInfo.id ? cardPhotoInfo.id : ""}
                    inputDisabled={!isEditExisting}
                    handleFileUpload={() => {
                      this.handleFileUpload("card", values.caption);
                    }}
                    handleFileChange={fileInfo =>
                      this.handleFileChange("card", fileInfo)
                    }
                    handleProgressReachedMax={() => {
                      this.setState({
                        cardModalCancelButtonLabel: "Close"
                      });
                    }}
                    fileName={
                      cardPhotoInfo.fileName
                        ? cardPhotoInfo.fileName
                        : "unknown"
                    }
                  />
                </ConfirmModal>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

BandForm.propTypes = {
  cardProgress: PropTypes.number,
  errors: PropTypes.object,
  getAppearancesForBandId: PropTypes.func.isRequired,
  selectCardPhotosForBand: PropTypes.func.isRequired,
  selectThumbPhotosForBand: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired, // from react-router
  getBandInfoForId: PropTypes.func.isRequired,
  isEditExisting: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  match: PropTypes.object,
  notifyInfo: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  saveBandClear: PropTypes.func,
  // saveNewPhoto: PropTypes.func.isRequired,
  saveNewPhotoAndUploadProcess: PropTypes.func,
  saveStatus: PropTypes.string,
  saveError: PropTypes.object,
  sendStorageCardStart: PropTypes.func,
  sendStorageThumbStart: PropTypes.func,
  thumbProgress: PropTypes.number,
  thisYear: PropTypes.number.isRequired,
  submitDataToServer: PropTypes.func.isRequired,
  values: PropTypes.object,
  yearsAvailable: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
};

export default BandForm;
