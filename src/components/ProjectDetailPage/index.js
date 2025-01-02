import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
const ProjectDetailPage = withStyles(({ spacing }) => {
  return {
    root: { margin: "10px 0" },
    due: { backgroundColor: "rgb(166, 226, 41)" },
    overDue: { backgroundColor: "rgb(220,0,0)" },
    text: {
      padding: spacing(0.5),
    },
  };
})(({ classes, data }) => {
  return (
    <div>
      {Object.keys(data).length > 0 &&
        Object.keys(data).map((item, index) => {
          return (
            <Card key={index} className={classes.root}>
              <CardHeader
                avatar={
                  <Avatar
                    className={
                      data[item].ConfirmDate.split("-")[0] === "1970"
                        ? classes.overDue
                        : classes.due
                    }>
                    {data[item].Doc}
                  </Avatar>
                }
                title={data[item].orderNumber}
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.text}>
                  {`UnitDesignation:${data[item].UnitDesignation}`}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.text}>
                  {`ProductFamily:${data[item].ProductFamily}`}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.text}>
                  {`InstallationMethod:${data[item].InstallationMethod}`}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.text}>
                  {`PlanDate:${
                    data[item].PlanDate.split("-")[0] === "1970"
                      ? "-"
                      : data[item].PlanDate
                  }`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`PlanDate:${
                    data[item].ConfirmDate.split("-")[0] === "1970"
                      ? "-"
                      : data[item].ConfirmDate
                  }`}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
});

export default ProjectDetailPage;
