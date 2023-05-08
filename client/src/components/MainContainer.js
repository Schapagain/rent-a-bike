import React from "react";
import SignIn from "./SignIn";
import HomePage from "./HomePage";
import Checkout from "./Checkout";
import Menu from "./Menu";
import SignUp from "./SignUp";
import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import About from "./About";
import BikeInfo from "./BikeInfo";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function MainContainer({ order }) {
  return (
    <div className="w-full h-full flex bg-bike bg-cover">
      <Switch>
        <Route
          exact
          path="/login"
          render={(props) => (
            <div className="main-page-container">
              <NavBar
                activeLink="login"
                className="z-50 rounded-xl text-white"
              />
              <SignIn {...props.location.state} />
            </div>
          )}
        />
        <Route exact path="/about">
          <div className="main-page-container">
            <NavBar activeLink="about" className="z-50 rounded-x text-white" />
            <About className="text-offwhite" />
          </div>
        </Route>
        <Route exact path="/signup">
          <div className="main-page-container">
            <NavBar
              activeLink="signup"
              className="z-50 rounded-xl text-white"
            />
            <SignUp />
          </div>
        </Route>
        <Route exact path="/checkout">
          <div className="main-page-container">
            <Checkout />
          </div>
        </Route>
        <Route exact path="/bikes">
          <div className="main-page-container">
            <NavBar activeLink="bikes" className="z-30 rounded-xl text-white" />
            <Menu className="text-offwhite z-30" />
            {/* <Drawer /> */}
          </div>
        </Route>
        <Route exact path="/bike/:id">
          <div className="main-page-container">
            <NavBar className="z-30 rounded-xl text-white" />
            <BikeInfo />
          </div>
        </Route>
        <Route path="/">
          <div className="main-page-container">
            <NavBar showCart={true} className="z-50 text-white" />
            <HomePage />
            {/* {order && order.totalBikes && <Drawer />} */}
          </div>
        </Route>
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
  order: state.order.order,
});

MainContainer.propTypes = {
  order: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {})(MainContainer);
