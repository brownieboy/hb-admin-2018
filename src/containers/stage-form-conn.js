import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  selectCardPhotosForStage,
  selectThumbPhotosForStage
} from "../dux/selectors/reselect-selectors.js";

// Components
import StageForm from "../components/stage-form.js";

// Dux
import {
  saveNewStage,
  saveEditedStage,
  saveStageClear,
  getStageInfoForId as getStageInfoForIdAction
} from "../dux/stagesReducer.js";

import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const getCommonStateObject = state => ({
  saveStatus: state.stagesState.saveStatus,
  saveError: state.stagesState.saveError,
  getStageInfoForId: stageId =>
    getStageInfoForIdAction(state.stagesState.stagesList, stageId),
  selectCardPhotosForStage: stageId => selectCardPhotosForStage(state, stageId),
  selectThumbPhotosForStage: stageId => selectThumbPhotosForStage(state, stageId),
  isLoggedIn: state.firebaseLoginState.loggedIn
});

// So we're connecting the same form to Redux, but with different props
// and state depending on whether we're creating a new one or
// editing an existing one
const mapDispatchToPropsNew = dispatch =>
  bindActionCreators(
    { notifyInfo, submitDataToServer: saveNewStage, saveStageClear },
    dispatch
  );
const mapStateToPropsNew = state => ({
  ...getCommonStateObject(state),
  isEditExisting: false
});

const mapDispatchToPropsEdit = dispatch =>
  bindActionCreators(
    {
      notifyInfo,
      submitDataToServer: saveEditedStage
    },
    dispatch
  );
const mapStateToPropsEdit = state => ({
  ...getCommonStateObject(state),
  isEditExisting: true
});

export const StageFormNewConn = connect(
  mapStateToPropsNew,
  mapDispatchToPropsNew
)(StageForm);

export const StageFormEditConn = connect(
  mapStateToPropsEdit,
  mapDispatchToPropsEdit
)(StageForm);
