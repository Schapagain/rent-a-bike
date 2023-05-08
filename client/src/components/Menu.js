import React, { useState } from "react";
import Bikes from "./Bikes";
import Button from "./Button";
import { MenuItem, OutlinedInput, Select, Slider } from "@material-ui/core";
import { connect } from "react-redux";
import { getBikes } from '../actions/bikeActions';
import {GoSettings} from 'react-icons/go';

const ALL_BIKES = 'all';

const FilterPanel = ({ onChange }) => {

  const [visible, setVisible] = useState(false);
  const [availableCategory] = useState([
    ALL_BIKES,
    "road",
    "kids",
    "city",
    "mountain",
    "electric",
    "bmx",
    "gravel",
  ]);

  const [filters, setFilters] = useState({

    min_price: 0,
    max_price: 300,
    category: null,
    color: null,
    brand: null,
    available: null,
    material: null,
  })

  const handleSliderChange = (e, newValue) => {
    setFilters((f) => ({ ...f, min_price: newValue[0], max_price: newValue[1] }));
  }

  const handleFilterUpdate = (e) => {

    const filterName = e.target.name;
    let filterValue = e.target.value;
    if (filterName === 'category' && filterValue.includes(ALL_BIKES)) {
      filterValue = e.nativeEvent?.target.innerText === ALL_BIKES ? "" : filterValue.filter(f => f !== ALL_BIKES)
    }
    if (filterName === 'category' || filterName === 'color') {
      filterValue = filterValue.join(',');
    }

    setFilters((f) => ({ ...f, [filterName]: filterValue }))
  }

  const makeValueText = (val) => {
    return `$${val}`
  }
  const handleApply = () => {
    if (onChange) {
      onChange(filters);
    }
  }

  return (
    <div className="relative">
      <Button icon={<GoSettings />} className="bg-theme-color rounded-full transform-none" text="Filters" onClick={() => setVisible(v => !v)} />
      {visible && <div className="w-56 p-5 bg-white rounded-sm absolute z-50 text-black right-0 top-14 shadow-2xl">
        <div>
          Price ($/hr):
          <Slider
            getAriaLabel={() => 'price range'}
            value={[filters.min_price, filters.max_price]}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            step={10}
            min={0}
            max={300}
            getAriaValueText={makeValueText}
          />
        </div>
        <div className="flex flex-col">
          Bike Type
          <Select
            multiple
            name="category"
            value={filters.category ? filters.category.split(',') : ['all']}
            onChange={handleFilterUpdate}
            input={<OutlinedInput label="Multiple Select" />}
          >
            {availableCategory.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Button text="Apply" className="rounded-full bg-theme-color transform-none" onClick={handleApply} />
      </div>}
    </div>
  )

}

function Menu({ className, getBikes }) {

  const handleFilterChange = (filters) => {
    getBikes(filters);
  }

  return (
    <div
      className={`${className} overflow-x-hidden relative select-none rounded-2xl bg-opacity-40 w-full min-h-screen max-w-screen-xl flex flex-col mr-10 p-5 xl:p-20 xl:m-auto`}
    >
      <div className="flex justify-between"><h2 className="text-4xl mb-3">Latest Bikes</h2>
        <div><FilterPanel onChange={handleFilterChange} /></div> </div>
      <Bikes />
    </div>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { getBikes })(Menu);
