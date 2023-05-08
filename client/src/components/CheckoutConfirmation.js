import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "./Button";
import store from "../store";
import { FINISH_CHECKOUT, CLEAR_CART } from "../actions/types";

const CheckoutConfirmation = () => {
  const history = useHistory();

  useEffect(() => {
    store.dispatch({ type: CLEAR_CART });
  }, []);

  const handleClick = () => {
    store.dispatch({ type: FINISH_CHECKOUT });
    history.push("/menu");
  };
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-3xl mb-5">Thank you for your order</h1>
      <p>
        We have emailed your order confirmation, and will send you an update
        when your order is ready
      </p>
      <Button
        text="Continue shopping"
        onClick={handleClick}
        className="w-1/3 mr-2 transform-none 1 bg-theme-color"
      />
    </div>
  );
};

export default CheckoutConfirmation;
