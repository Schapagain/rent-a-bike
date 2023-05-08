import React from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function Spinner() {
  return (
    <div className="flex justify-center w-full">
      <CgSpinnerTwoAlt className="text-4xl animate-spin" />
    </div>
  );
}
