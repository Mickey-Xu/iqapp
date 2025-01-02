import React from "react";
import { connect } from "react-redux";
import { SingleLine } from "./SingleLine";

const Form = ({ data = {}, fields = [], onChange, validation }) => {
  return fields.map(({ component: Component = SingleLine, ...rest }, index) => {
    const { name } = rest;
    return (
      <Component
        data={data}
        errorMessage={data[name] !== undefined && validation[name]?.message}
        key={index}
        onChange={onChange(data)}
        {...rest}
      />
    );
  });
};

export default connect(
  ({ formData }) => {
    return {
      data: formData,
    };
  },
  (dispatch, { onChange }) => {
    return (
      // !onChange && {
      //   onChange: (data) => (name, value) => {
      //     dispatch(action.setFormData({ ...data, [name]: value }));
      //   },
      // }
      { onChange }
    );
  }
)(Form);
