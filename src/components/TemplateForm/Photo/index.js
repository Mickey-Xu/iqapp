import { Box, FormLabel, makeStyles, Typography } from "@material-ui/core";
import Compressor from "compressorjs";
import { LocalizeContext } from "i18n";
import { fillTextToImg } from "js/util";
import React, { useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import Camera from "../../Camera"
import * as api from "api/index";

const useStyles = makeStyles(({ spacing }) => ({
  btm: {
    display: "flex",
    justifyContent: "space-between",
    margin: spacing(1, 1, 0, 1),
  },
  root: {
    display: "grid",
    padding: spacing(1, 0),
    borderBottom: " 1px solid #e0e0e0",
    backgroundColor: "#FFF",
  },
  lable: {
    margin: spacing(0, 0, 1, 0),
    color: "rgba(0, 0, 0, 0.87)",
  },
  inputFile: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    top: "0",
    zIndex: -1,
  },
  file: {
    height: "160px",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
}));

export const Photo = (props) => {
  const i18n = React.useContext(LocalizeContext);
  const classes = useStyles();
  const [photoStyle, setPhotoStyle] = useState({
    width: "auto",
    height: "100%",
  });
  const photoEl = useRef(null);
  const iptRef = useRef(null);
  const projectData = useParams();
  const showWatermark = projectData?.activityNo === "7030" && (props?.identifier === "photoJ" || props?.identifier === "photoP")
  const onPhotoChange = (e, type, isOnline) => {
    const fileReader = new FileReader();
    const file = e?.target?.files?.[0];

    if (type === "camera") {
      if (showWatermark) {
        fillTextToImg(e, projectData, isOnline).then((res) => {
          props.onChange(res);
        })
      } else {
        props.onChange(e);
      }
    } else {
      fileReader.onloadend = (e) => {
        const photo = e.target.result;
        if (showWatermark) {
          fillTextToImg(photo, projectData, isOnline).then((res) => {
            props.onChange(res);
          })
        } else {
          props.onChange(photo);
        }

        const i = new Image();
        i.onload = () => {
          setPhotoStyle({
            // width: photoEl.current.clientWidth,
            // height: (photoEl.current.clientWidth / i.width) * i.height,
            width: "auto",
            height: "100%",
          });
        };
        i.src = photo;
      };

    }

 
    if (file||e) {
      new Compressor(file, {
        quality: 0.2,
        convertSize: 400000,
        success(result) {
          fileReader.readAsDataURL(result);
        },
        error(err) {
          console.log(err.message);
        },
      });
    } else {
      props.onChange("#");
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.lable}>
        {props.label}
      </Typography>
      <div>
        <input
          className={classes.inputFile}
          type="file"
          accept="image/x-png,image/jpeg,image/gif"
          // accept="image/*"
          // capture="user"
          id={props.id}
          ref={iptRef}
          onChange={onPhotoChange}
        />
      </div>
      <div>
        {/* <Typography variant="body2">{props.description}</Typography> */}
        <FormLabel required={props.required}>
          <Typography
            component="span"
            variant="subtitle2"
            className={classes.lable}
          >
            {props.description}
          </Typography>
        </FormLabel>
      </div>
      <Box border={1} className={classes.file}>
        <img src={props.value} style={photoStyle} ref={photoEl} alt="" />
      </Box>
      <Box className={classes.btm}>
        <Typography
          color="secondary"
          variant="body2"
          onClick={() => {
            props.onChange("#");
            iptRef.current.value = "";
          }}
        >
          {i18n.ISNTAPP_DELETE}
        </Typography>
        <label htmlFor={props.id}>
          {!showWatermark && <Typography color="secondary" variant="body2">
            {i18n.ISNTAPP_IMPORT_PICTURES}
          </Typography>
          }  
        </label>
        {showWatermark && (
          <Camera onChange={(photo) => {
            api.saveDraft({}).then((res) => {
              onPhotoChange(photo, 'camera', res?.code!==0)
            }).catch((error) => {
              onPhotoChange(photo, 'camera', error?.code!==0)
            })
          } }
            showCameraFrame={showWatermark}
          />
        )}
      </Box>
    </div>
  );
};
