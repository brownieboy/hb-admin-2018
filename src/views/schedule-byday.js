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

class ScheduleByDay extends Component {
  getAppearanceLines = lineData => {
    // const itemsLength = lineData.length;
    const { adjustmentsMadeDirtyArray } = this.props;
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
                  <span
                    style={{
                      fontWeight: "bold"
                    }}
                  >
                    {lineMember.bandName}
                  </span>
                </Link>

                <span style={{ fontSize: 12 }}> ({lineMember.stageName})</span>
              </span>
            </div>
            <div style={{ height: "20px" }}>
              <Input
                type="checkbox"
                className="form-check-input"
                onChange={e => this.props.handleCheck(e, lineMember.id)}
              />

              {/*  <Link
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

  getAppearancesListDayLevel = groupedDayData =>
    groupedDayData.map(dayMember => [
      <div key={dayMember.key}>
        <span style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
          {dayMember.key.toUpperCase()}
        </span>
      </div>,
      <ListGroup
        key={`${dayMember.key}-stagewrapper`}
        style={{ marginBottom: 20 }}
      >
        {this.getAppearanceLines(dayMember.values)}
      </ListGroup>
    ]);

  handleDeleteItems = () => {
    this.setState({ showConfirmDeleteModal: true });
  };

  render() {
    const { appearancesGroupedByDay, fetchStatus, fetchError } = this.props;

    // console.log("ScheduleByDay render, appearancesGroupedByDay:");
    // console.log(appearancesGroupedByDay);

    return (
      <div>
        <LoadStatusIndicator
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <ListGroup style={listGroupStyles}>
          {this.getAppearancesListDayLevel(appearancesGroupedByDay)}
        </ListGroup>
      </div>
    );
  }
}

ScheduleByDay.propTypes = {
  adjustmentsMadeDirtyArray: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
  appearancesGroupedByDay: PropTypes.arrayOf(PropTypes.object.isRequired)
    .isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchError: PropTypes.string.isRequired,
  handleCheck: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ScheduleByDay;
