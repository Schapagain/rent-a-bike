import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Spinner from "./Spinner";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import { signUp } from "../actions/authActions";
import IdUpload from "./IdUpload";
import { clearErrors } from "../actions/errorActions";
import Copyright from "./Copyright";
import StepIcon from "./StepIcon";
// TODO: show feedback for image upload

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: "none",
  },
  signin: {
    marginTop: theme.spacing(1),
  },
  image: {
    width: "100%",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#065F46",
    color: "white",
  },
  stepIcon: {
    color: "#065F46",
    active: { color: "pink" },
  },
  alternativeLabel: {},
  active: { color: "blue" },
  completed: {},
}));

function getSteps() {
  return ["Company Information", "Employee ID Card", "Personal Information"];
}

const SignUp = ({ signUp, error, isLoading, clearErrors }) => {
  const classes = useStyles();
  // create state to hold form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState(null);
  const [nextDisabled, setNextDisabled] = useState(true);
  // state for what step of sign up we're at
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  // showing errors if they exist
  let history = useHistory();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    checkDisabled();
  });
  useEffect(() => {
    if (error.id === "REGISTER_FAIL") setMsg(error.msg);
    if (error.id === "REGISTER_SUCCESS") {
      history.push({
        pathname: "/login",
        state: { signUpSuccess: true },
      });
      clearErrors();
    }
  }, [error, history, clearErrors]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // posts form data to server
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = new FormData();
    newUser.append("name", name);
    newUser.append("email", email);
    newUser.append("password", password);
    newUser.append("organization", organization);
    newUser.append("employeeId", employeeId);
    newUser.append("phone", phone);
    newUser.append("idCard", idCard);
    //attempt to register user
    signUp(newUser);
  };

  const checkDisabled = () => {
    if (activeStep === 0) {
      const fields = [organization, employeeId, phone];
      const nextDisabled = fields.reduce(
        (disabled, field) => Boolean(field) && disabled
      );
      setNextDisabled(!nextDisabled);
    } else if (activeStep === 1) {
      setNextDisabled(!idCard);
    } else if (activeStep === 2) {
      const fields = [name, email, password];
      const nextDisabled = fields.reduce(
        (disabled, field) => Boolean(field) && disabled
      );
      setNextDisabled(!nextDisabled);
    }
  };

  const SignUpButtons = () => (
    <Grid container justify="space-between">
      {!isLoading && (
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={activeStep === 0 ? classes.buttonDisabled : classes.button}
        >
          Back
        </Button>
      )}
      {activeStep !== steps.length - 1 ? (
        <Button
          variant="contained"
          onClick={handleNext}
          className={nextDisabled ? classes.buttonDisabled : classes.button}
          disabled={nextDisabled}
        >
          Next
        </Button>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Sign Up
          </Button>
        </>
      )}
      <Grid container justify="flex-end" className={classes.signin}>
        <Grid item>
          <Link className="hover:underline" to="/login">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <div className="h-full flex flex-col items-center justify-start text-white m-auto w-full sm:w-1/2 xl:w-1/3 max-w-screen-xl">
      <CssBaseline />
      <div className={classes.paper}>
        <div className="w-10 flex h-10 bg-theme-color rounded-full">
          <LockOutlinedIcon className="text-4xl m-auto" />
        </div>
        <h1 className="text-3xl mb-1">Sign Up</h1>

        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel
                  icon={<StepIcon currentStep={activeStep} step={index + 1} />}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Thank you for signing up! We have sent an activation code to your
              email. Please activate your account and then click below to sign
              in
            </Typography>
            <Button>Sign In</Button>
          </div>
        ) : (
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2} justify="center">
              <Grid item xs={12}>
                {activeStep === 0 ? (
                  <Grid item xs={12}>
                    <Grid container spacing={2} justify="center">
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="organization"
                          name="organization"
                          variant="outlined"
                          required
                          fullWidth
                          id="organization"
                          label="Organization"
                          autoFocus
                          value={organization}
                          onChange={(e) => {
                            setOrganization(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="Employee ID"
                          name="employeeId"
                          variant="outlined"
                          required
                          fullWidth
                          id="employeeId"
                          label="Employee ID"
                          value={employeeId}
                          onChange={(e) => {
                            setEmployeeId(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="Phone"
                          name="phone"
                          variant="outlined"
                          required
                          fullWidth
                          id="phone"
                          label="Phone"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : activeStep === 1 ? (
                  <IdUpload idCard={idCard} setIdCard={setIdCard} />
                ) : (
                  <Grid item xs={12}>
                    <Grid container spacing={2} justify="center">
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="name"
                          name="name"
                          variant="outlined"
                          required
                          fullWidth
                          id="name"
                          label="Name"
                          autoFocus
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
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
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {msg !== "" ? (
                <Alert severity="error">{msg && msg.msg ? msg.msg : msg}</Alert>
              ) : null}
              <Grid item xs={12}>
                <SignUpButtons />
              </Grid>
            </Grid>
          </form>
        )}
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
  };
};

SignUp.propTypes = {
  isLoading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { signUp, clearErrors })(SignUp);
