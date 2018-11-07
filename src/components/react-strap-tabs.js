import React, { Component } from "react";
import { NavItem, NavLink, TabPane } from "reactstrap";
import PropTypes from "prop-types";
import classnames from "classnames";

// export class ViewTabsContent extends Component {
//   render() {
//     const { tabId, tabPaneStyle } = this.props;
//     return (
//       <TabPane tabId={tabId} style={tabPaneStyle}>
//         <div>Content here via render prop?</div>
//       </TabPane>
//     );
//   }
// }

export class ViewTabItemLink extends Component {
  render() {
    const { tabId, activeTabId, title, handleClick } = this.props;
    return (
      <NavItem>
        <NavLink
          className={classnames({
            active: activeTabId === tabId
          })}
          onClick={() => {
            handleClick(tabId);
          }}
        >
          {title}
        </NavLink>
      </NavItem>
    );
  }
}

// ViewTabsContent.propTypes = {
//   tabId: PropTypes.string.isRequired,
//   tabPaneStyle: PropTypes.object
// };

ViewTabItemLink.propTypes = {
  tabId: PropTypes.string.isRequired,
  activeTabId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};
