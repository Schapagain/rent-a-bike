import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";

import { removeBikeFromOrder } from "../actions/orderActions";
import CheckoutSingleBike from "./CheckoutSingleBike";

import OrderInfo from "./OrderInfo";

const CheckoutOrderReview = ({ order, removeBikeFromOrder }) => {
  const bikeIds = Array.from(order.bikes.keys());
  return (
    <div>
      <h1>Review Your Order</h1>
      <div item xs={12}>
        {bikeIds.map((bikeId) => (
          <CheckoutSingleBike
            key={bikeId}
            bikeName={order.bikes.get(bikeId).bike.name}
            bikeQuantity={order.bikes.get(bikeId).quantity}
            bikePrice={order.bikes.get(bikeId).bike.price}
            removeBikeFromOrder={removeBikeFromOrder}
          />
        ))}
      </div>
      <Grid container item xs={12}>
        <Grid container item xs={10}>
          <Typography variant="h6">Total</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">${order.totalPrice}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  order: state.order.order,
  bikes: state.bike.bikes,
});
export default connect(mapStateToProps, { removeBikeFromOrder })(
  CheckoutOrderReview
);
