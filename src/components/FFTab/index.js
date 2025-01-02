import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";

const useStyles = makeStyles((theme) => ({
  tab: {
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  },
  root: {
    backgroundColor: " #FFF",
  },
}));

const FFTab = ({ tabs, selectedTabValue, onTabChange }) => {
  const classes = useStyles();

  const [value, setValue] = React.useState(selectedTabValue);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Tabs
      className={classes.root}
      value={value}
      indicatorColor="secondary"
      textColor="secondary"
      onChange={handleTabChange}
      variant="fullWidth"
    >
      {tabs.map((i, index) => {
        return (
          <Tab
            key={index}
            label={i.title}
            value={i.value}
            className={classes.tab}
          />
        );
      })}
    </Tabs>
  );
};

export default FFTab;
