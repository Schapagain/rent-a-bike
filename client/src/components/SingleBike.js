import React from "react";
import Pill from "./Pill";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import BikeHighlights from "./BikeHighlights";

export default function SingleBike({ bike }) {
  const { name, price, category, picture } = bike;
  const history = useHistory();
  return (
    <div className="w-full shadow-xl bg-white text-black rounded-sm overflow-hidden my-2 cursor-pointer flex flex-col">
      <div
        onClick={() => history.push(`/bike/${bike.id}`)}
        className="h-full w-full rounded-xl flex relative flex-col sm:flex-row"
      >
       <div className="w-full sm:w-1/3 shadow-sm">
          <img className="h-auto sm:h-full w-full object-fill" src={picture} alt="bike" />
        </div>
        <div className="h-full p-5 pb-16 flex flex-col w-full sm:w-2/3">
            <p className="text-2xl">{name}</p>
            <div className="flex gap-2 my-2">{category.map(cat=>(<Pill key={bike.id+cat}><span>{cat}</span></Pill>))}</div>
            {bike && bike.highlightedFeatures && <BikeHighlights bike={bike} max={3}/>}
            {price && <p className="absolute text-xl bottom-2 right-5">
              ${(Number(price).toFixed(0))}/hr
            </p>}
        </div>
      </div>
    </div>
  );
}
