import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { ListGroup, ListGroupItem } from "reactstrap";

import { ThumbNail } from "../components/photo-display.js";
import PhotoCard from "../components/photo-card.js";
// import { handleCheck as handleCheckExt } from "../components/lifecycleextras.js";

import {
  buttonsBottomWrapperStyles,
  listGroupItemContentWrapperStyles,
  listGroupItemStyles,
  listGroupStyles,
  itemTextSpan,
  listGroupItemColStyles
} from "./viewstyles.js";

const tabPaneListGroupStyle = {
  ...listGroupStyles,
  overflowY: "auto"
};

const DisplayImage = ({ photoMember }) => {
  // console.log("DisplayImage photoMember:");
  // console.log(photoMember);
  if (photoMember.photoType === "thumb") {
    return (
      <ThumbNail
        thumbFullUrl={photoMember.fullUrl}
        size={80}
        round={photoMember.type === "band"}
      />
    );
  }
  return <PhotoCard cardFullUrl={photoMember.fullUrl} preview={true} />;
};

DisplayImage.propTypes = {
  photoMember: PropTypes.object.isRequired
};

// renderLine is a render prop (hear me roar!)  It's passed in from
// photos-wrapper, and allows us to vary the grid without having
// to duplicate all the
class PhotosViewGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandsToDisplay: "all",
      // selectedItems: []
      showConfirmDeleteModal: false,
      showPhotosAssociatedWithBandsModal: false
    };
    // this.handleCheck = handleCheckExt.bind(this);
  }

  listPhotos = ({ photosArray, renderLine, styles, handleCheck, selectedPhotos }) =>
    photosArray.map(photoMember => (
      <ListGroupItem key={photoMember.id} style={listGroupItemStyles}>
        {renderLine({
          handleCheck,
          selectedPhotos,
          photoMember,
          styles,
          DisplayImage
        })}
      </ListGroupItem>
    ));

  render() {
    const { photosArray, renderLine, handleCheck, selectedPhotos } = this.props;
    const styles = {
      listGroupItemContentWrapperStyles,
      listGroupItemColStyles
    };
    return (
      <ListGroup
        style={{ ...tabPaneListGroupStyle, marginLeft: 0 }}
        className="container"
      >
        {this.listPhotos({ photosArray, renderLine, styles, handleCheck, selectedPhotos })}
      </ListGroup>
    );
  }
}

PhotosViewGrid.propTypes = {
  photosArray: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  renderLine: PropTypes.func.isRequired,
  selectedPhotos: PropTypes.arrayOf(PropTypes.string).isRequired,  // array of IDs
  handleCheck: PropTypes.func.isRequired
};

export default PhotosViewGrid;

/*
class PhotosAll extends Component {
  listPhotos = photosArray =>
    photosArray.map(photoMember => (
      <ListGroupItem key={photoMember.filePath} style={listGroupItemStyles}>
        <div style={listGroupItemContentWrapperStyles}>
          <span>{photoMember.fileName}</span>
          <span>{photoMember.type}</span>
          <span>{photoMember.photoType}</span>
          {photoMember.photoType === "thumb" ? (
            <ThumbNail thumbFullUrl={photoMember.fullUrl} size={80} />
          ) : (
            <PhotoCard cardFullUrl={photoMember.fullUrl} preview={true} />
          )}
        </div>
      </ListGroupItem>
    ));

  render() {
    const { photosArray } = this.props;
    return (
      <Fragment>
        {this.listPhotos(photosArray)}
      </Fragment>
    );
  }
}
 */
