import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  value: {
    padding: spacing(1, 0),
    borderTop: " 1px solid #e0e0e0",
    borderBottom: " 1px solid #e0e0e0",
    margin: "0",
  },
}));

export const StaticText = (props) => {
  const classes = useStyles();
  const formattedText = props.value?.replace(/\n/g, '<br />'); 
  return (
    <Box>
      <Typography variant="subtitle2" className={classes.value}>
        <div dangerouslySetInnerHTML={{ __html: formattedText }}></div>
      </Typography>
      {props.images.map((item, index) => {
        return (
          <div key={index}>
            <img src={item.url} alt="" style={{ maxWidth: "100%" }} />;
          </div>
        );
      })}
    </Box>
  );
};
