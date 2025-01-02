import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import { connect } from "react-redux";

const SelectBale = ({ selectBox, number, selectBale }) => {
  return (
    <div>
      <Checkbox
        onClick={(event) => selectBox(event)}
        checked={selectBale.some((item) => {
          return item === number;
        })}
        color="primary"
      />
    </div>
  );
};

export default connect(({ selectBale }, { number }) => {
  return { number, selectBale };
})(SelectBale);
