import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as action from "actions";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(({ spacing }) => ({
  main: {
    margin: spacing(1, 2),
  },
  formControl: {
    marginBottom: spacing(2),
  },
  submit: {
    position: "fixed",
    bottom: spacing(12),
    width: "90%",
  },
  descript: {
    marginTop: spacing(1),
  },
}));

const ChangePassword = ({ submit }) => {
  const classes = useStyles();
  const i18n = React.useContext(LocalizeContext);

  const [values, setValues] = React.useState({
    oldPassword: "",
    newPassword: "",
    confrimNewPassword: "",
  });

  const [isShowPassword, setShowPassword] = React.useState({
    oldPassword: false,
    newPassword: false,
    confrimNewPassword: false,
  });

  const fields = [
    {
      name: "oldPassword",
      label: i18n.ISNTAPP_OLD_PASSWORD,
      showPassword: isShowPassword.oldPassword,
    },
    {
      name: "newPassword",
      label: i18n.ISNTAPP_NEW_PASSWORD,
      showPassword: isShowPassword.newPassword,
    },
    {
      name: "confrimNewPassword",
      label: i18n.ISNTAPP_CONFIRME_CHANGE_PASSWORD,
      showPassword: isShowPassword.confrimNewPassword,
      descript: "密码必须是由6-16位的数字、大写字母、小写字母、特殊字符组成。",
    },
  ];

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value.trim() });
  };

  const handleClickShowPassword = (name) => (event) => {
    setShowPassword({ ...isShowPassword, [name]: !isShowPassword[name] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const verificationSubmit = () => {
    if (!values.oldPassword) {
      alert("请输入旧密码");
    } else if (!values.newPassword) {
      alert("请输入新密码");
    } else if (checkoutPassword(values.newPassword)) {
      return true;
    } else if (!values.confrimNewPassword) {
      alert("请输入确认新密码");
    } else if (values.oldPassword === values.confrimNewPassword) {
      alert("新密码与旧密码不能相同");
    } else if (checkoutPassword(values.confrimNewPassword)) {
      return true;
    } else if (values.newPassword !== values.confrimNewPassword) {
      alert("两次新密码不一致");
    } else {
      submit({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
    }
  };

  const checkoutPassword = (password) => {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var hasNonalphas = /\W/.test(password);

    if (password.length < 6) {
      alert("请至少输入6位密码");
      return true;
    } else if (password.length > 16) {
      alert("密码长度不能大于16位");
      return true;
    } else if (!hasUpperCase) {
      alert("请至少输入一个大写字母");
      return true;
    } else if (!hasLowerCase) {
      alert("请至少输入一个小写字母");
      return true;
    } else if (!hasNumbers) {
      alert("请至少输入一个数字");
      return true;
    } else if (!hasNonalphas) {
      alert("请至少输入一个特殊字符");
      return true;
    } else {
      return false;
    }
  };

  return (
    <PrimaryLayout title={i18n.ISNTAPP_CHANGE_PASSWORD}>
      <Box className={classes.main}>
        {fields.map((item, index) => {
          return (
            <FormControl
              fullWidth
              required
              key={index}
              className={classes.formControl}
            >
              <InputLabel>{item.label}</InputLabel>
              <Input
                maxLength="8"
                type={item.showPassword ? "text" : "password"}
                value={item.password}
                onChange={handleChange(item.name)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword(item.name)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {item.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.descript}
              >
                {item.descript}
              </Typography>
            </FormControl>
          );
        })}
        <Box className={classes.submit}>
          <Button
            style={{
              backgroundColor: "rgb(220,2,2)",
              color: "white",
              textTransform: "capitalize",
            }}
            fullWidth
            onClick={() => verificationSubmit()}
            size="large"
            variant="contained"
          >
            {i18n.ISNTAPP_CHANGE_PASSWORD}
          </Button>
        </Box>
      </Box>
    </PrimaryLayout>
  );
};

const mapStateToPops = (state, ownProps) => {
  return {};
};

const mapDispatchToState = (dispatch) => {
  return {
    submit: (values) => {
      dispatch(action.changePassword(values));
    },
  };
};

export default connect(mapStateToPops, mapDispatchToState)(ChangePassword);
