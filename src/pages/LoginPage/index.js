import { Box, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import schindler from "assets/img/logo.png";
import Alert from "components/Alert";
import Form, {
  Checkbox,
  hasError,
  Password,
  PhoneNumber,
  validate,
} from "components/Form";
import Loading from "components/Loading";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import store from "js/store";

const LoginPage = withStyles(() => {
  return {
    root: {
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      padding: "16vh 16px",
    },
    logo: {
      display: "flex",
      justifyContent: "center",
    },
    title: {
      textAlign: "center",
      color: "rgb(220,2,2)",
    },
    submit: {
      textTransform: "none",
      color: "white",
      backgroundColor: "rgb(220,2,2)",
    },
  };
})(({ classes, data, loading, location, onChange, submit, setAuth }) => {
  const history = useHistory();

  const fields = [
    {
      name: "userNameOrEmailAddress",
      component: PhoneNumber,
      label: " 工号/手机号",
      required: true,
    },
    {
      name: "password",
      component: Password,
      label: "密码",
      required: true,
    },
    {
      name: "rememberMe",
      component: Checkbox,
      label: "记住密码",
    },
  ];

  const validation = validate(fields, data);

  const onSubmit = () => {
    if (
      data["userNameOrEmailAddress"] === undefined ||
      data["userNameOrEmailAddress"] === ""
    ) {
      alert(" 工号/手机号");
    } else if (data["password"] === undefined || data["password"] === "") {
      alert("请输入密码");
    }
    if (!hasError(validation)) {
      submit(data).then((res) => {
        if (res?.isPwdInit) {
          const firstLogin = true;
          setAuth(data);
          window.localStorage.setItem("auth", JSON.stringify(data));
          history.push({
            pathname: `/newUserResetPassword/${firstLogin}/${data.password}`,
          });
        } else {
          console.log()
          if (store.getState()?.auth?.["roles"]?.[0] === "SL") {
            history.push({ pathname: "/synchronize" });
          } else {
            history.push({ pathname: "/activities" });
          }
       
        }
      });
    }
  };

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.logo}>
          <img
            src={schindler}
            alt="Schindler Logo"
            style={{ height: "16vh" }}
          />
        </Box>
        <Box
          mt={3}
          mb={2}
          className={classes.title}
          fontSize="h6.fontSize"
          fontWeight="fontWeightBold"
        >
          SCF NI INSTALLATION QUALITY
        </Box>
        <Box my={2}>
          <Form fields={fields} onChange={onChange} validation={validation} />
        </Box>
        <Box my={2}>
          <Button
            disabled={loading}
            style={{ backgroundColor: "rgb(220,2,2)", color: "white" }}
            fullWidth
            onClick={onSubmit}
            size="large"
            variant="contained"
          >
            登录
          </Button>
        </Box>
      </Box>
      <Loading />
      <Alert />
    </>
  );
});

export default connect(
  ({ formData, loading }) => {
    return { data: formData, loading };
  },
  (dispatch) => {
    return {
      onChange: (data) => (name, value) => {
        if (name === "username" && !value) {
          dispatch(
            action.setFormData({ ...data, [name]: value, rememberMe: false })
          );
        } else {
          dispatch(action.setFormData({ ...data, [name]: value }));
        }
      },
      submit: (data) => {
        return dispatch(action.login(data));
      },
      setAuth: (data) => {
        dispatch(action.setAuth(data));
      },
    };
  }
)(LoginPage);
