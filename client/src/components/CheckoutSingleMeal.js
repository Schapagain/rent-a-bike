import React from "react";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0.5em",
    paddingLeft: 0,
    paddingRight: 0,
    margin: "0.25em",
  },
  bikeNameContainer: {
    padding: 0,
  },
  bikeName: {
    fontSize: "1rem",
  },
}));

const CheckoutSingleBike = ({
  bikeId,
  bikeName,
  bikePrice,
  bikeQuantity,
  removeBikeFromOrder,
}) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid container item xs={10}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.bikeName}>
            {bikeName} (x{bikeQuantity})
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              removeBikeFromOrder(bikeId);
            }}
          >
            Remove
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1">${bikePrice * bikeQuantity}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default CheckoutSingleBike;
