import React from "react";
import { connect } from "react-redux";
import { logOut } from "../actions/authActions";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Logout = ({ closeMenu, logOut }) => {
  const history = useHistory();
  return (
    <MenuItem onClick={()=>{logOut();closeMenu();history.push("/");}}>Log out</MenuItem>
  );
};

export default connect(null, { logOut })(Logout);

Logout.propTypes = {
  logOut: PropTypes.func.isRequired,
};
