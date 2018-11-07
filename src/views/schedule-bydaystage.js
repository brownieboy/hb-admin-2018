import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { LoadStatusIndicator } from "../components/loadsaveindicator.js";
import { ThumbNail } from "../components/photo-display.js";

import {
  listGroupItemContentWrapperStyles,
  listGroupItemSmallStyles,
  listGroupStyles
} from "./viewstyles.js";

// key={lineMember.id}

class ScheduleByDayStage extends Component {
  getAppearanceLines = lineData => {
    // const itemsLength = lineData.length;
    const { adjustmentsMadeDirtyArray, selectedItems } = this.props;
    return lineData.map((lineMember, index) => {
      // const lineStyle = { height: 40 };
      // if (itemsLength === index + 1) {
      //   lineStyle.borderBottomWidth = 0;
      // }
      const listItemStyles = adjustmentsMadeDirtyArray.includes(lineMember.id)
        ? { ...listGroupItemSmallStyles, backgroundColor: "#fce2b8" }
        : lineMember.isCancelled
          ? { ...listGroupItemSmallStyles, backgroundColor: "#f0f0f5" }
          : listGroupItemSmallStyles;
      return (
        <ListGroupItem key={lineMember.id} style={listItemStyles}>
          <div style={listGroupItemContentWrapperStyles}>
            <div>
              <ThumbNail thumbFullUrl={lineMember.bandThumbFullUrl} size={30} />
              <span
                style={{
                  textDecoration: lineMember.isCancelled ? "line-through" : null
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {`${format(lineMember.dateTimeStart, "HH:mm")}-${format(
                    lineMember.dateTimeEnd,
                    "HH:mm"
                  )}: `}
                </span>
                <Link to={`/scheduleform/${lineMember.id}`}>
                  <span style={{ fontWeight: "bold" }}>
                    {lineMember.bandName}
                  </span>{" "}
                </Link>
              </span>
            </div>
            <div style={{ height: "20px" }}>
              <Input
                type="checkbox"
                checked={selectedItems.includes(lineMember.id)}
                className="form-check-input"
                onChange={e => this.props.handleCheck(e, lineMember.id)}
              />

              {/*    <Link
                to={`/scheduleform/${lineMember.id}`}
                style={{ marginLeft: 20 }}
              >
                <i className="icon-pencil" />
              </Link> */}
            </div>
          </div>
        </ListGroupItem>
      );
    });
  };

  getAppearancesStageLevel = groupedStageData =>
    groupedStageData.map(stageMember => [
      <div key={stageMember.key} style={{ marginTop: 15 }}>
        <span style={{ fontSize: 14, fontStyle: "italic" }}>
          {stageMember.key.split("~")[1]}
        </span>
      </div>,
      <ListGroup key={`${stageMember.key}-lineswrapper`}>
        {this.getAppearanceLines(stageMember.values)}
      </ListGroup>
    ]);

  getAppearancesListDayLevel = groupedDayData =>
    groupedDayData.map(dayMember => [
      <div key={dayMember.key} style={{ marginBottom: -15 }}>
        <span style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
          {dayMember.key.toUpperCase()}
        </span>
      </div>,
      <ListGroup
        key={`${dayMember.key}-stagewrapper`}
        style={{ marginBottom: 20 }}
      >
        {this.getAppearancesStageLevel(dayMember.values)}
      </ListGroup>
    ]);

  // handleDeleteItems = () => {
  //   this.setState({ showConfirmDeleteModal: true });
  // };

  render() {
    const {
      appearancesGroupedByDayThenStage,
      fetchStatus,
      fetchError
    } = this.props;

    return (
      <div>
        <LoadStatusIndicator
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <ListGroup style={listGroupStyles}>
          {this.getAppearancesListDayLevel(appearancesGroupedByDayThenStage)}
        </ListGroup>
      </div>
    );
  }
}

ScheduleByDayStage.propTypes = {
  adjustmentsMadeDirtyArray: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
  appearancesGroupedByDayThenStage: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchError: PropTypes.string.isRequired,
  handleCheck: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ScheduleByDayStage;
