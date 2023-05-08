import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "./Button";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  addOrder,
  setDeliveryTime,
  setDeliveryType,
} from "../actions/orderActions";
import { confirmCardPayment } from "../actions/paymentActions";
import Spinner from "./Spinner";

const useStyles = makeStyles((theme) => ({
  payment: {
    fontSize: "1.8rem",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const selectClasses =
  "cursor-pointer p-2 bg-theme-color outline-none rounded-lg";

const DeliveryDetails = ({
  handleTypeChange,
  deliveryTime,
  deliveryType,
  handleTimeChange,
}) => {
  return (
    <div>
      <h1 className="text-3xl text-center">DELIVERY DETAILS</h1>
      <form className="flex w-full flex-col p-2">
        <fieldset className="m-4 flex w-full justify-between">
          <label className="my-auto" htmlFor="type-select-lable">
            Order Type
          </label>
          <select
            className={selectClasses}
            id="type-select-label"
            value={deliveryType}
            onChange={handleTypeChange}
          >
            <option value="dinein">Dine in</option>
            <option value="delivery">Delivery</option>
            <option value="takeout">Take Out</option>
          </select>
        </fieldset>
        <fieldset className="flex w-full justify-between m-4">
          <label className="my-auto" htmlFor="time-select-lable">
            Delivery Time
          </label>
          <select
            className={selectClasses}
            id="time-select-label"
            value={deliveryTime}
            onChange={handleTimeChange}
          >
            <option value={1}>In an hour</option>
            <option value={2}>Two hours from now</option>
            <option value={4}>Four hours from now</option>
          </select>
        </fieldset>
      </form>
    </div>
  );
};

const PaymentForm = ({
  addOrder,
  setDeliveryTime,
  setDeliveryType,
  payment,
  error,
  confirmCardPayment,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  const [deliveryType, setType] = useState("dinein");
  const [deliveryTime, setTime] = useState(1);

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setDeliveryTime(e.target.value);
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
    setDeliveryType(e.target.value);
  };

  // error msg state
  useEffect(() => {
    if (error.id === "CONFIRM_CARD_PAYMENT_FAIL") {
      setErrorMsg(error.msg);
    }
    return () => {
      setErrorMsg("");
    };
  }, [error, payment]);

  const cardStyle = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: "Roboto, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#ffffff",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const history = useHistory();

  const handleChange = async (e) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(e.empty || (e.error && e.error.message));
    setErrorMsg(e.error ? e.error.message : "");
  };

  const handleClick = async (e) => {
    // e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    await confirmCardPayment(stripe, payment.clientSecret, {
      card: elements.getElement(CardElement),
    });

    if (error.id === "CONFIRM_CARD_PAYMENT_FAIL") return;
    addOrder();
  };

  return (
    <Grid container justify="center" className={classes.root} spacing={1}>
      <DeliveryDetails
        deliveryTime={deliveryTime}
        deliveryType={deliveryType}
        handleTimeChange={handleTimeChange}
        handleTypeChange={handleTypeChange}
      />

      <Grid item xs={12}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      </Grid>
      <Grid item xs={12}>
        {payment.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex">
            <Button
              text="Continue shopping"
              onClick={() => history.push("/menu")}
              className="w-1/3 mr-2 transform-none 1 bg-theme-color"
            />
            <Button
              className={
                "w-2/3 ml-2 transform-none " +
                (disabled
                  ? "bg-gray-500 cursor-auto hover:shadow-none"
                  : "bg-theme-color")
              }
              onClick={
                !stripe ||
                payment.isLoading ||
                !payment.clientSecret ||
                disabled
                  ? (e) => {}
                  : handleClick
              }
              text="Pay now"
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  payment: state.payment,
  error: state.error,
});

export default connect(mapStateToProps, {
  addOrder,
  setDeliveryTime,
  setDeliveryType,
  confirmCardPayment,
})(PaymentForm);
