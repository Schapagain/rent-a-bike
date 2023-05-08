import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";
import Button from "./Button";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addBikeToOrder, removeBikeFromOrder } from "../actions/orderActions";
import { useHistory } from "react-router-dom";
import OrderInfo from "./OrderInfo";

const Leaf = ({ cartOpen, setCartOpen, numItems }) => {
  const transitions = useTransition(cartOpen, null, {
    from: { transform: "translate3d(-250%,0,0)" },
    enter: { transform: "translate3d(50%,0,0)" },
    leave: { transform: "translate3d(-250%,0,0)" },
    reverse: cartOpen,
    unique: true,
    reset: true,
    initial: { transform: "translate3d(100%,0,0)" },
  });
  return (
    <>
      {transitions.map(({ key, props }) => (
        <animated.div
          key={key}
          style={props}
          onClick={() => setCartOpen(!cartOpen)}
          className="bg-theme-color text-offwhite cursor-pointer z-40 fixed rounded-full top-1/2 transform -translate-y-1/2 right-0 w-32 h-32"
        >
          <div className="absolute left-1/2 transform -translate-y-1/2 -translate-x-full top-1/2 text-5xl">
            <AiOutlineShoppingCart className="transform  -scale-x-100" />
            {numItems > 0 && (
              <div className="absolute text-white top-0 left-0 bg-theme-color h-5 w-5 flex items-center text-xs justify-center p-3 rounded-full">
                {numItems}
              </div>
            )}
          </div>
        </animated.div>
      ))}
    </>
  );
};

const CheckoutButton = ({ handleCheckout }) => (
  <Button
    onClick={handleCheckout}
    text="Checkout"
    className="mx-auto bg-gray-700 text-black"
  />
);

export const Drawer = ({ order, addBikeToOrder, removeBikeFromOrder }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const orderMap = (order && order.bikes) || new Map();
  const bikesInOrder = Array.from(orderMap.values());
  const numItems = order.totalBikes;
  const total = order.totalPrice;

  const transitions = useTransition(cartOpen, null, {
    from: { transform: "translate3d(100%,0,0)" },
    enter: { transform: "translate3d(0%,0,0)" },
    leave: { transform: "translate3d(100%,0,0)" },
  });

  const history = useHistory();

  const handleCheckout = () => {
    history.push("/checkout");
    setCartOpen(false);
  };

  return (
    <div className="select-none">
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              className="text-white bg-theme-color z-50 fixed cursor-pointer flex flex-col h-screen w-96 top-0 right-0"
              key={key}
              style={props}
            >
              <h1 className="p-3 w-full pt-10 mb-10 bg-gray-600 bg-opacity-50 text-center text-3xl">
                Your bag
              </h1>
              <div className="p-5 w-full flex flex-col items-end h-5/6">
                {numItems > 0 ? (
                  <>
                    <OrderInfo
                      bikes={bikesInOrder}
                      addBikeToOrder={addBikeToOrder}
                      removeBikeFromOrder={removeBikeFromOrder}
                      total={total}
                    />
                    <CheckoutButton handleCheckout={handleCheckout} />
                  </>
                ) : (
                  <p className="m-auto">Oops your cart is empty</p>
                )}
              </div>
            </animated.div>
          )
      )}
      <Leaf cartOpen={cartOpen} setCartOpen={setCartOpen} numItems={numItems} />
    </div>
  );
};

Drawer.propTypes = {
  order: PropTypes.object.isRequired,
  addBikeToOrder: PropTypes.func.isRequired,
  removeBikeFromOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  order: state.order.order,
});

export default connect(mapStateToProps, {
  addBikeToOrder,
  removeBikeFromOrder,
})(Drawer);
