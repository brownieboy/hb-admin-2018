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
      cardStorageFileInfo: {}
    };
    this.linkWrapperRef = React.createRef();
  }

  classId = "";

  handleFileChange = (photoType, fileInfo) => {
    // console.log("handleThumbFileChange");
    // console.log(event.target.files[0]);
    // console.log("BandForm..handleFileChange");
    const newPhotoInfo = {
      ...this.state[`${photoType}PhotoInfo`],
      fileName: fileInfo.name
    };
    this.setState({
      [`${photoType}StorageFileInfo`]: fileInfo,
      [`${photoType}PhotoInfo`]: newPhotoInfo
    });
  };

/*
From photoForm
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

Need to replicate this below....

 */


  handleFileUpload = photoType => {
    // Note: the new photo boject created in handleNewImageClick has not
    // been saved to Redux Store at this point.  So we need to that and
    // then actually upload the image to Storage.
    console.log("BandForm..handleFileUpload");
    const { saveNewPhotoAndUploadProcess } = this.props;
    const photoInfo = this.state[`${photoType}PhotoInfo`];
    const storageFileInfo = this.state[`${photoType}StorageFileInfo`];
    // Triggers savePhotoInfoAndUploadsaga watche din writeFirebasePhotoSagas.js
    saveNewPhotoAndUploadProcess(photoInfo, storageFileInfo, {});
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
    // console.log("Clearing from componentWillUnmount");
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
      thumbStorageFileInfo,
      cardStorageFileInfo
    } = this.state;

    let fieldValues = {
      name: "",
      id: "",
      summary: "",
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
      if (matchingInfo) {
        fieldValues = Object.assign({ yearsAppearing: [] }, matchingInfo);
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
      }
    } else {
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
                  <div
                    name="imagesWrapper"
                    style={{ marginBottom: 100, marginTop: 10 }}
                  >
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
              </div>
            );
          }}
        />
        <ConfirmModal
          displayModal={!!thumbPhotoInfo.fileName}
          modalTitle="Upload Thumbnail Image"
          handleCancel={() => {
            this.setState({ thumbPhotoInfo: {} });
          }}
        >
          <ImageUploaderConn
            photoId={thumbPhotoInfo.id ? thumbPhotoInfo.id : ""}
            inputDisabled={!isEditExisting}
            handleFileUpload={() => this.handleFileUpload("thumb")}
            handleFileChange={fileInfo =>
              this.handleFileChange("thumb", fileInfo)
            }
            fileName={
              thumbPhotoInfo.fileName ? thumbPhotoInfo.fileName : "unknown"
            }
          />
        </ConfirmModal>
      </div>
    );
  }
}

/*

                  <span ref={this.linkWrapperRef} style={{ display: "none" }}>
                    <Link to={`/photoform/${newPhotoLinkId}`}>
                      Temp photo link
                    </Link>
                  </span>

https://findmyfbid.com/, https://findmyfbid.com/
*/

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
  saveNewPhoto: PropTypes.func.isRequired,
  saveNewPhotoAndUploadProcess: PropTypes.func.isRequired,
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
