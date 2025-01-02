import { Typography } from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 16,
  },

  line: {
    height: 1,
    border: 0,
    backgroundColor: "#CCCCCC",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid #4BC627",
    fontSize: "12px",
    zIndex: 1,
    width: 32,
    height: 32,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    border: "2px solid #CCCCCC",
  },
});

const ColorlibStep = (props) => {
  const classes = useColorlibStepStyles();
  const { active, completed, progress } = props;
  const icons = {
    1: progress.installationNotStarted,
    2: progress.startTheInstallation,
    3: progress.guideDoorInstallation,
    4: progress.debugQuantity,
    5: progress.handedOverToMaintenance,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
};

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: spacing(1),
  },
  instructions: {
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  label: {
    color: "#999999",
  },
  muiStepperRoot: {
    padding: spacing(3, 0, 3, 0),
  },
}));

export default function CustomizedSteppers(progress) {
  const classes = useStyles();
  const steps = ["未开始安装", "开始安装", "导轨门安装", "调试", "移交维保"];
  const Progress = progress;
  return (
    <div className={classes.root}>
      <Stepper alternativeLabel className={classes.muiStepperRoot}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={ColorlibStep}
              StepIconProps={progress}
            >
              <Typography className={classes.label} variant="overline">
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
