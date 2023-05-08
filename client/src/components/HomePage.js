import React from "react";
import Button from "./Button";
import { useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const IntroText = () => {
  return (
    <div className="z-50 text-center text-white">
      <p className="text-3xl sm:text-4xl lg:text-5xl mb-4">
        Ride the trails on the best of bikes
      </p>
      <div className="text-xl sm:text-2xl lg:text-3xl">
        <p>Without spending a fortune.</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const history = useHistory();

  const animation = useSpring({
    to: { transform: "translateY(0%)" },
    from: { transform: "translateY(-5%)" },
  });

  return (
    <div className="flex justify-center lg:justify-start mx-auto w-full max-w-screen-xl h-2/3 my-auto">
      <animated.div
        style={animation}
        className="flex flex-col my-auto"
      >
        <IntroText />
        <Button
          className="rounded-full bg-theme-color"
          text="Check Availability"
          onClick={() => history.push("/bikes")}
        />
      </animated.div>
    </div>
  );
};

export default HomePage;
