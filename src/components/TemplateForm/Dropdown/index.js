import { Box, FormHelperText, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    borderTop: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    padding: spacing(1, 0),
  },
  ListItemText: {
    borderBottom: "1px #eae8e8 dashed",
    padding: spacing(1, 0, 2, 0),
  },
  button: {
    textTransform: "capitalize",
    padding: " 0",
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export const Dropdown = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
  });
  const params = useParams()


  const toggleDrawer = (open) => (event) => {
    setState({ open: open });
  };

  const lable = props.options
    .map((item) => {
      return { name: item.nameI18n.English, value: item.value };
    })
    .find((item) => item.value === props.value);

  return (
    <Box className={classes.box}>
      <Button onClick={toggleDrawer(true)} className={classes.button}>
        {lable ? lable.name : props.label}
      </Button>
      <Drawer
        anchor="bottom"
        open={state["open"]}
        onClose={toggleDrawer(false)}
        disabled={disableForm(params)}
      >
        <List role="presentation" onClick={toggleDrawer(false)}>
          {props.options.map((item, index) => (
            <ListItem
              className={classes.listItem}
              button
              key={index}
              onClick={() => props.onChange(item.value)}
            >
              <ListItemText
                primary={item.nameI18n.English}
                className={classes.ListItemText}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <FormHelperText>{props.helperText}</FormHelperText>
    </Box>
  );
};
