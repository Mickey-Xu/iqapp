import React from "react";

export const SectionBreak = (props) => {
  return (
    <div>
      <h2>{props.label}</h2>
      <hr />
      <i>{props.description}</i>
    </div>
  );
};
