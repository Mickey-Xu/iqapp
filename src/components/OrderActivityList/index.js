import { Box, Typography } from "@material-ui/core";
import ConfirmModal from "components/ConfirmModal";
import { LocalizeContext } from "i18n";
import moment from "moment";
import React from "react";
import { DatePicker } from "@material-ui/pickers";

const OrderActivityList = ({
  data,
  component: Component,
  tabType,
  submit,
  oneThousandPlannedDate,
  nineThousandPlannedDate,
}) => {
  const [open, setOpen] = React.useState(null);
  const [activity, setActivity] = React.useState("");
  const [currentActivity, setCurrentActivity] = React.useState("");
  const [date, setDate] = React.useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const i18n = React.useContext(LocalizeContext);

  const handleClickOpen = (name, activity, currentActivity) => {
    setOpen(name);
    setActivity(activity);
    setCurrentActivity(currentActivity);
  };

  const handleClose = () => {
    setOpen(null);
    setDate(moment(new Date()).format("YYYY-MM-DD"));
  };

  const confirmedDateMinAndMax = () => {
    const currentData = activity
      ? data[
          Object.keys(data).filter((item) => {
            return data[item].activityNumber === activity;
          })[0]
        ]
      : data;
    if (activity) {
      if (currentData.confPreStart === "X") {
        return { min: 0, max: moment().format("YYYY-MM-DD") };
      } else {
        if (currentData.confPast === "0" || currentData.confPast === null) {
          return {
            min: moment().add(-5, "days").format("YYYY-MM-DD"),
            max: moment().format("YYYY-MM-DD"),
          };
        } else {
          return {
            min: moment()
              .add(-currentData.confPast, "days")
              .format("YYYY-MM-DD"),
            max: moment().format("YYYY-MM-DD"),
          };
        }
      }
    }
  };

  const handleClick = () => {
    let type = 0;

    if (open === "lock" || open === "unlock") {
      type = 2;
    }

    if (open === "confirm" || open === "cancel") {
      type = 1;
    }

    if ((open === "lock" || open === "confirm") && date) {
      submit(activity, date, type);
      setOpen(null);
    } else if (open === "unlock" || open === "cancel") {
      submit(activity, "", type);
      setOpen(null);
    }
  };

  if (data) {
    data.sort((a, b) => (a.sort ? (a.sort > b.sort ? 1 : -1) : 1));
  }

  return (
    <Box style={{ marginBottom: "16px" }}>
      {data?.map((item, index) => {
        return (
          <Component
            data={item}
            handleClickOpen={(name, activity, currentActivity) =>
              handleClickOpen(name, activity, currentActivity)
            }
            tabType={tabType}
            key={index}
          />
        );
      })}
      <ConfirmModal
        open={
          open === "lock" ||
          open === "unlock" ||
          open === "confirm" ||
          open === "cancel"
        }
        date={date}
        handleClick={handleClick}
        onClose={handleClose}
        title={currentActivity}
      >
        <Box mb={1} align="center" mr={5}>
          <Typography
            variant="body2"
            color={
              open === "lock" || open === "confirm"
                ? date
                  ? "initial"
                  : "error"
                : "initial"
            }
          >
            {open === "lock" || open === "confirm"
              ? `*${i18n.ISNTAPP_PLEASE_SELECT}${
                  open === "lock"
                    ? i18n.ORDERDETAILS_LOCK
                    : open === "confirm"
                    ? i18n.GENERAL_CONFIRM
                    : ""
                }${i18n.ISNTAPP_DETE}`
              : `${i18n.ISNTAPP_CONFIRM_TO}${
                  open === "unlock"
                    ? i18n.ORDERDETAILS_UNLOCK
                    : open === "cancel"
                    ? i18n.GENERAL_CANCEL
                    : ""
                }${i18n.ISNTAPP_DETE}?`}
          </Typography>
        </Box>
        <Box mb={1} align="center">
          {open === "lock" && (
            <input
              type="date"
              min={oneThousandPlannedDate}
              max={nineThousandPlannedDate}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              value={date}
            />
          )}
          {open === "confirm" && (
            // <input
            //   min={confirmedDateMinAndMax().min}
            //   max={confirmedDateMinAndMax().max}
            //   type="date"
            //   onChange={(e) => {
            //     setDate(e.target.value);
            //   }}
            //   value={date}
            // />

            <DatePicker
              autoOk
              disableToolbar={true}
              variant="inline"
              value={date ? new Date(date) : null}
              minDate={new Date(confirmedDateMinAndMax()?.min)}
              maxDate={new Date(confirmedDateMinAndMax()?.max)}
              format="YYYY/MM/DD"
              onChange={(d) => {
                setDate(moment(d).format("YYYY-MM-DD"));
              }}
            />
          )}
        </Box>
      </ConfirmModal>
    </Box>
  );
};

export default OrderActivityList;
