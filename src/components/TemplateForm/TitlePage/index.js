import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  logo: {
    width: "25vw",
    height: "auto",
  },

  description: {
    margin: spacing(2, 0, 1, 0),
  },
}));

export const TitlePage = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Box>
        {props?.logos?.map((logo) => {
          return (
            <img
              className={classes.logo}
              key={logo.id}
              src={logo.url}
              alt="logo"
            />
          );
        })}
      </Box>
      <Typography variant="subtitle2" className={classes.description}>
        {props?.description}
      </Typography>
    </Box>
  );
};
