import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "reactstrap";
import { notifyInfo as notifyInfoAction } from "../dux/react-redux-notify-helpers.js";
import { savePublishNow } from "../dux/publishReducer.js";
import { getAppearancesWithBandAndStageNames } from "../dux/appearancesReducer.js";
// import {
//   // selectors as bandSelectors,
//   // getBandsAlphabeticalEnhanced,
//   selectBandsPublish
// } from "../dux/bandsReducer.js";
import {
  // selectors as bandSelectors,
  // getBandsAlphabeticalEnhanced,
  selectBandsPublish, selectStagesPublish
} from "../dux/selectors/reselect-selectors.js";


const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notifyInfo: notifyInfoAction,
      publishNow: savePublishNow
      // getBandsAlphabeticalEnhanced
    },
    dispatch
  );

const mapStateToProps = state => ({
  loggedInState: state.firebaseLoginState,
  appearancesList: getAppearancesWithBandAndStageNames(state),
  // bandsList: getBandsAlphabeticalEnhanced(state.bandsState.bandsList),
  // thisYearsBandsList: bandSelectors.selectThisYearsBands(state),
  stagesList: selectStagesPublish(state),
  publishedBandsList: selectBandsPublish(state),
  homePageText: state.homeState.homeText,
  contactUsPage: state.contactUsState.contactUs
});

class PublishButton extends Component {
  handlePublish = () => {
    const {
      appearancesList,
      // bandsList,
      // thisYearsBandsList,
      publishedBandsList,
      homePageText,
      notifyInfo,
      publishNow,
      stagesList,
      contactUsPage
    } = this.props;
    // console.log("handlePublish, stagesList:");
    // console.log(stagesList);
    notifyInfo("Pushing updated data out to phones...");
    // console.log("publishButton, publishedBandsList:");
    // console.log(publishedBandsList);
    publishNow({
      appearancesArray: appearancesList,
      bandsArray: publishedBandsList,
      stagesArray: stagesList,
      homePageText,
      contactsPage: contactUsPage
    });
  };

  render() {
    return (
      <Button color="success" onClick={this.handlePublish}>
        Publish to Phones
      </Button>
    );
  }
}

PublishButton.propTypes = {
  appearancesList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  // bandsList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  // getBandsAlphabeticalEnhanced: PropTypes.func.isRequired,
  homePageText: PropTypes.string.isRequired,
  contactUsPage: PropTypes.object.isRequired,
  notifyInfo: PropTypes.func.isRequired,
  publishNow: PropTypes.func.isRequired,
  stagesList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  publishedBandsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

const PublishButtonConn = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButton);

export default PublishButtonConn;
