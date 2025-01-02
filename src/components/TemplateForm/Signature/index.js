import { makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import CreateIcon from "@material-ui/icons/Create";
import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { LocalizeContext } from "i18n";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    userSelect: "none",
    marginBottom: "400px",
  },
  sigContainer: {
    width: "100%",
    height: "250px",
    // border: "1px solid gray",
    // backgroundColor: "white",
    backgroundColor: theme.palette.background.paper,
  },
  sigPad: {
    width: "100%",
    height: "200px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "100%",
    height: "100px",
    marginTop: "8px",
    borderRadius: "5px",
    backgroundColor: "#eee",
    margin: theme.spacing(1, 0, 3, 0),
  },
}));

export const Signature = (props) => {
  const classes = useStyles();
  const i18n = React.useContext(LocalizeContext);
  const params = useParams()

  const [signModalOpen, setSignModalOpen] = useState(false);
  const [sPhotoStyle, setSPhotoStyle] = useState({
    width: "100%",
    height: "100%",
  });

  const sPadEl = useRef(null);
  const sPhotoEl = useRef(null);

  const clear = () => {
    sPadEl.current.clear();
  };

  const save = () => {
    const signPhoto = sPadEl.current.getTrimmedCanvas().toDataURL("image/png");
    props.onChange(signPhoto);
    const i = new Image();
    i.onload = () => {
      setSPhotoStyle({
        // width: sPhotoEl.current.clientWidth,
        // height: (sPhotoEl.current.clientWidth / i.width) * i.height,
        width: "100%",
        height: "100%",
        marginBottom: "24px",
      });
    };
    i.src = signPhoto;
    setSignModalOpen(false);
  };

  const signClick = () => {
    setSignModalOpen(true);
  };

  const handleClose = () => {
    setSignModalOpen(false);
  };

  return (
    <div classes={classes.root}>
      <Typography variant="subtitle2">{props.label}</Typography>
      <IconButton
        disabled={disableForm(params)}
        aria-label="sign"
        onClick={signClick}
        className={classes.icon}
      >
        <CreateIcon />
      </IconButton>
      <Modal
        className={classes.modal}
        open={signModalOpen}
        onClose={handleClose}
      >
        <div className={classes.sigContainer}>
          <div>
            <SignaturePad
              canvasProps={{ className: classes.sigPad }}
              ref={sPadEl}
            />
            <Button onClick={clear}>{i18n.INSTALLATION_CLEAR}</Button>
            <Button onClick={save}>{i18n.INSTALLATION_SAVE}</Button>
          </div>
        </div>
      </Modal>
      {/* <CardMedia style={sPhotoStyle} image={props.value} ref={sPhotoEl} />
       */}
      <img src={props.value} style={sPhotoStyle} ref={sPhotoEl} alt="" />
      <i>{props.description}</i>
    </div>
  );
};
