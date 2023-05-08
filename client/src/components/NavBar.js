import { useHistory } from "react-router-dom";
import { logOut } from "../actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Brand = () => {
  const history = useHistory();
  return (
    <a
      className="my-auto px-2 font-medium text-lg sm:text-3xl"
      href="!#"
      onClick={(e) => {
        e.preventDefault();
        history.push("/");
      }}
    >
      Rent A Bike
    </a>
  );
};

const NavLink = ({ text, onClick, active }) => {
  return (
    <a
      className={`${
        active && "bg-theme-color"
      } my-auto p-2 font-medium text-calypso text-sm sm:text-lg mx-4
            transition transform ease-in-out duration-700 hover:bg-theme-color hover:scale-110 hover:text-white rounded-full`}
      href="!#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {text}
    </a>
  );
};

const NavLinks = ({ isAuthenticated, activeLink, logOut }) => {
  const history = useHistory();
  return (
    <div className="flex">
      <NavLink
        active={activeLink === "bikes"}
        text="Bikes"
        onClick={() => history.push("/bikes")}
      />
      <NavLink
        active={activeLink === "about"}
        text="About"
        onClick={() => history.push("/about")}
      />
      {isAuthenticated ? (
        <NavLink
          text="Logout"
          onClick={() => {
            logOut();
            history.push("/");
          }}
        />
      ) : (
        <NavLink
          active={activeLink === "login"}
          text="Login"
          onClick={() => history.push("/login")}
        />
      )}
    </div>
  );
};

const NavBar = ({ activeLink, className, logOut, isAuthenticated }) => {
  return (
    <div
      className={
        className +
        " w-full mx-auto max-w-screen-xl flex p-1 m-4 justify-between"
      }
    >
      <Brand />
      <NavLinks
        activeLink={activeLink}
        isAuthenticated={isAuthenticated}
        logOut={logOut}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  className: PropTypes.string,
  logOut: PropTypes.func.isRequired,
  showCart: PropTypes.bool,
};

export default connect(mapStateToProps, { logOut })(NavBar);
