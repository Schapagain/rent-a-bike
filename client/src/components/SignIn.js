import React, { useState, useEffect } from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { signIn } from "../actions/authActions";
import { clearErrors } from "../actions/errorActions";
import Spinner from "./Spinner";
import Copyright from "./Copyright";

const SignIn = ({
  signIn,
  error,
  isLoading,
  signUpSuccess,
  checkoutFail,
  isAuthenticated,
  clearErrors,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errorFlag, setErrorFlag] = useState("ERROR");

  useEffect(() => {
    if (checkoutFail) {
      setErrorFlag("WARNING");
      setMsg("You must login before checking out!");
    }
    if (signUpSuccess) {
      setErrorFlag("SUCCESS");
      setMsg(
        "Signed up successfully! An activation link has been sent via email."
      );
    }
    if (error.id === "LOGIN_FAIL") {
      setErrorFlag("ERROR");
      setMsg(error.msg);
    }
  }, [error, signUpSuccess, checkoutFail]);

  // redirect if authenticated
  let history = useHistory();
  useEffect(() => {
    if (isAuthenticated) {
      clearErrors();
      checkoutFail ? history.push("/checkout") : history.push("/");
    }
    return () => {
      clearErrors();
    };
  }, [clearErrors, history, checkoutFail, isAuthenticated]);

  const handleSubmit = (e) => {
    clearErrors();
    const newUser = {
      email,
      password,
    };
    signIn(newUser);
  };

  return (
    <div className="h-2/3 flex flex-col items-center justify-start text-white m-auto w-full sm:w-1/2 xl:w-1/3 max-w-screen-xl">
      <div className="w-10 flex h-10 bg-theme-color rounded-full">
        <LockOutlinedIcon className="text-4xl m-auto" />
      </div>
      <h1 className="text-3xl">Sign In</h1>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          variant="filled"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          variant="filled"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {msg !== "" && <Alert severity={errorFlag.toLowerCase()}>{msg}</Alert>}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {/* I need this to make the form submit on enter */}
            <button type="submit" />
            <Button
              className="bg-theme-color w-full transform-none"
              text="SIGN IN"
              onClick={handleSubmit}
            />
            <div className="flex justify-end">
              <Link className=" p-1 hover:underline" to="/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
          </>
        )}
      </form>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { signIn, clearErrors })(SignIn);

SignIn.propTypes = {
  isLoading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
