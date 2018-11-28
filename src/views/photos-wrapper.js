import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Nav,
  TabContent,
  TabPane
} from "reactstrap";
import { Link } from "react-router-dom";
// import classnames from "classnames";

// import { handleCheck as handleCheckExt } from "../components/lifecycleextras.js";
import { getChecked } from "../components/lifecycleextras.js";
import ConfirmModal from "../components/confirm-modal.js";
// import AlertModal from "../components/alert-modal.js";
import { ViewTabItemLink } from "../components/react-strap-tabs.js";

import {
  buttonsBottomWrapperStyles
  // listGroupItemContentWrapperStyles,
  // listGroupItemStyles,
  // listGroupStyles,
  // itemTextSpan
} from "./viewstyles.js";

import {
  getScrollHeightPercent,
  MOBILEWIDTHCUTOFF
} from "../constants/general.js";

import PhotosViewGrid from "./photos-view-grid.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";
// import { ThumbNail } from "../components/photo-display.js";
// import PhotoCard from "../components/photo-card.js";

class PhotosWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "allPhotos",
      showConfirmDeleteModal: false,
      scrollHeightPercent: 70,
      selectedItems: [],
      selectedItemsEnhanced: [],
      browserWidth: 400,
      checkDeleteBinaries: true
    };
    // this.handleCheck = handleCheckExt.bind(this);
  }

  updateBrowserSizes = () => {
    this.setState({
      scrollHeightPercent: getScrollHeightPercent(),
      browserWidth: window.innerWidth
    });
  };

  // handleDeleteItems = () => {
  //   const { selectBandsAlphabeticalEnhanced } = this.props;
  //   const { selectedItems } = this.state;

  //   const selectedBandsWithAppearances = selectBandsAlphabeticalEnhanced.filter(
  //     bandItem =>
  //       selectedItems.includes(bandItem.id) &&
  //       bandItem.appearancesList &&
  //       bandItem.appearancesList.length > 0
  //   );

  //   if (selectedBandsWithAppearances.length === 0) {
  //     this.setState({ showConfirmDeleteModal: true });
  //   } else {
  //     const bandsWithAppearancesNames = selectedBandsWithAppearances
  //       .map(bandMember => bandMember.name)
  //       .sort();

  //     this.setState({
  //       showBandsWithAppearancesAlertModal: true,
  //       bandsWithAppearances: bandsWithAppearancesNames
  //     });
  //   }
  // };

  handleCheck = (e, id) => {
    const { selectPhotos } = this.props; // This is all of them
    const { selectedItems } = this.state;
    const newSelectedItems = getChecked(e, id, selectedItems);
    const selectedPhotoObjectsArray = selectPhotos.filter(photoMember =>
      newSelectedItems.includes(photoMember.id)
    );
    this.setState({
      selectedItems: newSelectedItems,
      selectedItemsEnhanced: selectedPhotoObjectsArray
    });
  };

  handleDeleteItems = () => {
    const { selectedItemsEnhanced } = this.state;

    let confirmDeleteExtraMessage = "";
    const selectedItemsInUse = selectedItemsEnhanced.filter(
      itemMember => itemMember.matchingThumbs || itemMember.matchingCards
    );

    const uniqueNamesInUse = selectedItemsInUse
      .map(item => item.assocEntityName)
      .filter((value, index, self) => self.indexOf(value) === index);

    /*
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// usage example:
var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']
 */

    if (selectedItemsInUse.length > 0) {
      confirmDeleteExtraMessage = `The photos you have selected are in use by these entities:
  
      ${uniqueNamesInUse.join(", ")}.\n\n

      If you proceed, these references will be removed.\n

      `;
    }

    // console.log("PhotosWrapper..handleDeleteItems, selectedItemsInUse:");
    // console.log(selectedItemsInUse);
    this.setState({ showConfirmDeleteModal: true, confirmDeleteExtraMessage });
  };

  // handleConfirmDelete = () => {
  //   const { selectPhotos } = this.props;
  //   const { selectedItems } = this.state;
  // };

  componentDidMount() {
    this.setState({
      scrollHeightPercent: getScrollHeightPercent(),
      browserWidth: window.innerWidth
    });
    window.addEventListener("resize", this.updateBrowserSizes);
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    const {
      startDeletePhotosProcess,
      isLoggedIn,
      selectPhotos, // All of them
      selectBandPhotos,
      selectStagePhotos
    } = this.props;
    const {
      activeTab,
      browserWidth,
      confirmDeleteExtraMessage,
      checkDeleteBinaries,
      scrollHeightPercent,
      selectedItems,
      selectedItemsEnhanced
    } = this.state;
    const mobileWidth = browserWidth <= MOBILEWIDTHCUTOFF;

    // console.log("selectBandPhotos:");
    // console.log(selectBandPhotos);
    const tabPaneStyle = {
      height: `${scrollHeightPercent}vh`,
      overflowY: "auto"
    };

    return (
      <Fragment>
        <div style={{ maxWidth: "530px" }}>
          {!isLoggedIn && <NotLoggedInWarning />}
          <Nav tabs>
            <ViewTabItemLink
              tabId="allPhotos"
              activeTabId={activeTab}
              handleClick={this.toggleTab}
              title="All Photos"
            />
            <ViewTabItemLink
              tabId="bandPhotos"
              activeTabId={activeTab}
              handleClick={this.toggleTab}
              title="Bands"
            />
            <ViewTabItemLink
              tabId="stagePhotos"
              activeTabId={activeTab}
              handleClick={this.toggleTab}
              title="Stages"
            />
          </Nav>
        </div>

        <TabContent activeTab={activeTab}>
          <TabPane tabId={"allPhotos"} style={tabPaneStyle}>
            <PhotosViewGrid
              photosArray={selectPhotos}
              selectedPhotos={selectedItems}
              handleCheck={this.handleCheck}
              renderLine={({
                handleCheck,
                selectedPhotos,
                photoMember,
                DisplayImage
              }) => (
                <div className="row">
                  <Link
                    to={`/photoform/${photoMember.id}`}
                    className="col-md-3"
                  >
                    <span>{photoMember.fileName}</span>
                  </Link>
                  <span className="col-md-4">
                    {photoMember.assocEntityName}
                  </span>
                  <span className="col-md-1">{photoMember.type}</span>
                  <span className="col-md-3 text-center">
                    <DisplayImage photoMember={photoMember} />
                  </span>
                  <span
                    style={{ height: "20px" }}
                    className="col-md-1 text-right"
                  >
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedPhotos.includes(photoMember.id)}
                      onChange={e => handleCheck(e, photoMember.id)}
                    />
                  </span>
                </div>
              )}
            />
          </TabPane>
          <TabPane tabId={"bandPhotos"} style={tabPaneStyle}>
            <PhotosViewGrid
              photosArray={selectBandPhotos}
              selectedPhotos={selectedItems}
              handleCheck={this.handleCheck}
              renderLine={({
                handleCheck,
                selectedPhotos,
                photoMember,
                DisplayImage
              }) => (
                <div className="row">
                  <span className="col-md-4">
                    {photoMember.assocEntityName}
                  </span>
                  <Link
                    to={`/photoform/${photoMember.id}`}
                    className="col-md-4"
                  >
                    <span>{photoMember.fileName}</span>
                  </Link>
                  <span className="col-md-3 text-center">
                    <DisplayImage photoMember={photoMember} />
                  </span>
                  <span
                    style={{ height: "20px" }}
                    className="col-md-1 text-right"
                  >
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedPhotos.includes(photoMember.id)}
                      onChange={e => handleCheck(e, photoMember.id)}
                    />
                  </span>
                </div>
              )}
            />
          </TabPane>
          <TabPane tabId={"stagePhotos"} style={tabPaneStyle}>
            <PhotosViewGrid
              photosArray={selectStagePhotos}
              selectedPhotos={selectedItems}
              handleCheck={this.handleCheck}
              renderLine={({
                handleCheck,
                selectedPhotos,
                photoMember,
                DisplayImage
              }) => (
                <div className="row">
                  <span className="col-md-4">
                    {photoMember.assocEntityName}
                  </span>
                  <Link
                    to={`/photoform/${photoMember.id}`}
                    className="col-md-4"
                  >
                    <span>{photoMember.fileName}</span>
                  </Link>
                  <span className="col-md-3 text-center">
                    <DisplayImage photoMember={photoMember} />
                  </span>
                  <span
                    style={{ height: "20px" }}
                    className="col-md-1 text-right"
                  >
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedPhotos.includes(photoMember.id)}
                      onChange={e => handleCheck(e, photoMember.id)}
                    />
                  </span>
                </div>
              )}
            />
          </TabPane>
        </TabContent>
        <div style={buttonsBottomWrapperStyles}>
          <Button
            color="primary"
            size={mobileWidth ? "sm" : null}
            style={{ marginLeft: 10 }}
          >
            <Link
              to="/photoform"
              style={{ display: "block", height: "100%", color: "white" }}
            >
              Add photo
            </Link>
          </Button>
          <Button
            color="danger"
            size={mobileWidth ? "sm" : null}
            disabled={this.state.selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.handleDeleteItems}
          >
            Delete selected
          </Button>
          <ConfirmModal
            displayModal={this.state.showConfirmDeleteModal}
            modalTitle="Delete Photos?"
            modalBody={`${confirmDeleteExtraMessage}Are you sure that you want to delete the selected photos?`}
            handleOk={() => {
              // Triggers START_DELETE_PHOTOS_PROCESS action type, listened to by
              // writeFirebasePhotoSagas saga
              startDeletePhotosProcess({
                selectedItemsEnhanced,
                deleteBinaries: checkDeleteBinaries
              });
              this.setState({ showConfirmDeleteModal: false });
            }}
            handleCancel={() =>
              this.setState({ showConfirmDeleteModal: false })
            }
          >
            <FormGroup check style={{ marginTop: 10 }}>
              <Label check>
                <Input
                  type="checkbox"
                  checked={checkDeleteBinaries}
                  onChange={e =>
                    this.setState({ checkDeleteBinaries: !checkDeleteBinaries })
                  }
                />{" "}
                Deleted associated binary images from storage
              </Label>
            </FormGroup>
          </ConfirmModal>
        </div>
      </Fragment>
    );
  }
}

PhotosWrapper.propTypes = {
  startDeletePhotosProcess: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  selectPhotos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectBandPhotos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectStagePhotos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default PhotosWrapper;
