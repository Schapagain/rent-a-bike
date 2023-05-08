import React from "react";
import { BiCheck } from "react-icons/bi";

export default function StepIcon({ step, currentStep }) {
  return (
    <div
      className={`${
        currentStep < step - 1 ? "bg-gray-500" : "bg-theme-color"
      } rounded-full text-white flex justify-center items-center w-6 h-6`}
    >
      {currentStep >= step ? <BiCheck /> : step}
    </div>
  );
}
