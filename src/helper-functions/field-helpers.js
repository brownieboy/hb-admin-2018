import React from "react";

export const OptionsForArray = ({
  sourceArray,
  valuePropertyName,
  displayPropertyName
}) =>
  sourceArray.map(member => (
    <option key={member[valuePropertyName]} value={member[valuePropertyName]}>
      {member[displayPropertyName]}
    </option>
  ));
