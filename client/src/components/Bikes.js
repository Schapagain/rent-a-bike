import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SingleBike from "./SingleBike";
import { addBikeToOrder } from "../actions/orderActions";
import Skeleton from "@material-ui/lab/Skeleton";
import { MdUnfoldMore } from "react-icons/md";
import Button from "./Button";
import { makeStyles } from "@material-ui/styles";

const MAX_DISPLAY_COUNT_DEFAULT = 5;

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "1rem",
    backgroundColor: "rgba(255,255,255,0.088)",
    '&:after':{
      background: "linear-gradient(90deg, transparent, rgba(21,101,52,0.3), transparent)"
    }
  },
}));

const Bikes = ({ bike, filter, addBikeToOrder }) => {
  let { bikes, isLoading } = bike;
  const [numDisplayed, setNumDisplayed] = useState(MAX_DISPLAY_COUNT_DEFAULT);
 
  const muiClasses = useStyles();

  return bikes.length ? (
    <div
      className="flex flex-wrap w-full mb-10 h-full flex-row"
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-wrap gap-2 w-full align-items-end justify-start h-full">
          {(isLoading ? Array.from(new Array(10)) : bikes)
            .slice(0, numDisplayed)
            .map((bike, index) =>
              bike ? (
                <SingleBike
                  key={bike.id || index}
                  bike={bike}
                />
              ) : (
                <Skeleton
                  key={index}
                  animation="wave"
                  variant="rect"
                  width="100%"
                  height={200}
                  classes={{root: muiClasses.root}}
                />
              )
            )}
        </div>
      </div>
      <Button className="bg-theme-color rounded-full" text="Load More" icon={<MdUnfoldMore className="text-xl" />} onClick={() => setNumDisplayed(num => num + 5)} />
    </div>
  ) : (
    <> </>
  );
};

Bikes.propTypes = {
  bike: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  bike: state.bike,
  order: state.order.order,
});

export default connect(mapStateToProps, { addBikeToOrder })(Bikes);
