import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import ContactUsForm from "../components/contactus-form.js";

// Dux
import {
  // saveNewContactUs,
  saveEditedContactUs
} from "../dux/contactUsReducer.js";

import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const getCommonStateObject = state => ({
  fetchStatus: state.contactUsState.fetchStatus,
  fetchError: state.contactUsState.fetchError,
  saveStatus: state.contactUsState.saveStatus,
  saveError: state.contactUsState.saveError,
  isLoggedIn: state.firebaseLoginState.loggedIn
});

// So we're connecting the same form to Redux, but with different props
// and state depending on whether we're creating a new one or
// editing an existing one
// const mapDispatchToPropsNew = dispatch =>
//   bindActionCreators({ submitDataToServer: saveNewContactUs }, dispatch);
// const mapStateToPropsNew = state => ({
//   ...getCommonStateObject(state),
//   isEditExisting: false
// });

const mapDispatchToPropsEdit = dispatch =>
  bindActionCreators(
    { notifyInfo, submitDataToServer: saveEditedContactUs },
    dispatch
  );

const mapStateToPropsEdit = state => ({
  ...getCommonStateObject(state),
  startBlurb: state.contactUsState.contactUs.startBlurb,
  email1: state.contactUsState.contactUs.email1,
  email2: state.contactUsState.contactUs.email2,
  helstonburyWebUrl: state.contactUsState.contactUs.helstonburyWebUrl,
  helstonburyFBID: state.contactUsState.contactUs.helstonburyFBID,
  helstonburyMerchandiseFBID:
    state.contactUsState.contactUs.helstonburyMerchandiseFBID,
  helstonburyMerchandiseFBText:
    state.contactUsState.contactUs.helstonburyMerchandiseFBText,
  mobile: state.contactUsState.contactUs.mobile,
  gettingThereBlurb: state.contactUsState.contactUs.gettingThereBlurb,
  locationBlurb: state.contactUsState.contactUs.locationBlurb,
  mapLinkText: state.contactUsState.contactUs.mapLinkText,
  venueAddress: state.contactUsState.contactUs.venueAddress,
  venueEmail: state.contactUsState.contactUs.venueEmail,
  venuePhone: state.contactUsState.contactUs.venuePhone,
  appTips: state.contactUsState.contactUs.appTips,
  isEditExisting: true
});

// export const ContactUsFormNewConn = connect(
//   mapStateToPropsNew,
//   mapDispatchToPropsNew
// )(ContactUsForm);

const ContactUsFormEditConn = connect(
  mapStateToPropsEdit,
  mapDispatchToPropsEdit
)(ContactUsForm);

export default ContactUsFormEditConn;
