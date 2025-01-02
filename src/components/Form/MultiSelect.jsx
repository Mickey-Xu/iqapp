import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const MultiSelect = withStyles(({ spacing }) => {
  return {
    root: {
      margin: spacing(2, 0, 1, 0),
    },
  };
})(({ classes, data = {}, label, name, options = [], onChange }) => {
  const handleChange = (value) => (e) => {
    if (e.target.checked) {
      const newValue = data[name] ? data[name].slice() : [];
      newValue.push(value);
      onChange(name, newValue);
    } else {
      const newValue = data[name].filter((element) => {
        return element !== value;
      });
      onChange(name, newValue);
    }
  };

  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        {options.map((item, index) => {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={
                    (data[name] &&
                      data[name].some((element) => {
                        return element === item.value;
                      })) ||
                    false
                  }
                  name={item.value}
                  onChange={handleChange(item.value)}
                />
              }
              label={item.text}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
});

export default MultiSelect;
