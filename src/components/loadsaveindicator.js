import React from "react";

export const LoadStatusIndicator = ({ fetchStatus, fetchError }) => (
  <div>
    {/* <div>Load status: {fetchStatus}</div> */}
    {fetchStatus === "loading" && (
      <div>
        <i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }} />
      </div>
    )}
    {fetchStatus === "failure" && (
      <div>`Error: ${JSON.stringify(fetchError, null, 4)}`</div>
    )}
  </div>
);

export const SaveStatusIndicator = ({ saveStatus, saveError }) => (
  <div>
    <div>Save status: {saveStatus}</div>
    {saveStatus === "saving" && (
      <div>
        <i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }} />
      </div>
    )}
    {saveStatus === "failure" && (
      <div>`Error: ${JSON.stringify(saveError, null, 4)}`</div>
    )}
  </div>
);

/*
      <div>Load status: {fetchStatus}</div>
      <div>Save status: {saveStatus}</div>
      {(saveStatus === "saving" || fetchStatus === "loading") && (
        <i className="fa fa-refresh fa-spin" style={{ fontSize: "24px" }} />
      )}
      <br />
      {saveStatus === "failure" &&
        `Error: ${JSON.stringify(saveError, null, 4)}`}
 */
