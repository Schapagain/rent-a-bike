import React, { useEffect } from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import store from "./store";
import { loadUser } from "./actions/authActions";
import MainContainer from "./components/MainContainer";
import { getBikes } from "./actions/bikeActions";

const stripePromise = loadStripe(
  "pk_test_51I8QurI5qzReycR9FSYytJ8iPoxfXFQwYObAZC0x8jXsHY6K6XOCZ8AtF6N8NDiDpPC58I090d88Q0i0Y4PudyZo00AFJEaifB"
);

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(getBikes());
  }, []);
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="w-full flex min-h-screen">
            <MainContainer />
          </div>
        </Router>
      </Elements>
    </Provider>
  );
}

export default App;
