import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBikeInfo } from "../actions/bikeActions";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import Pill from "./Pill";
import Spinner from "./Spinner";
import Button from "./Button";
import BikeHighlights from './BikeHighlights';

const Arrow = ({className}) => (<svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd"></path></svg>)

function BikeInfo({ bike, getBikeInfo }) {
    const { id } = useParams();
    const { selectedBike } = bike;
    const history = useHistory();
    useEffect(() => {
        getBikeInfo(id)
    }, [id, getBikeInfo])
    return (
        <div
            className={`overflow-x-hidden relative select-none rounded-2xl bg-opacity-40 w-full max-w-screen-xl flex justify-center flex-col mr-10 p-5 xl:p-20 xl:m-auto`}
        >
            <div className="w-full shadow-xl bg-white text-black overflow-hidden my-2 cursor-pointer flex flex-col">
                {selectedBike && selectedBike.id ? <div
                    className="w-full rounded-xl flex relative flex-col sm:flex-row"
                >
                    <div className="w-full sm:w-1/2 lg:w-8/12 shadow-sm">
                        <img className="h-auto sm:h-full w-full object-fill" src={selectedBike.picture} alt="bike" />
                    </div>
                    <div className="h-full p-5 pb-16 flex flex-col w-full sm:w-2/3 lg:w-4/12">
                        <p className="text-2xl">{selectedBike.name}</p>
                        <div className="flex gap-2 my-2">{selectedBike.category.map(cat => (<Pill key={selectedBike.id + cat}><span>{cat}</span></Pill>))}</div>
                        <BikeHighlights bike={selectedBike}/>
                        <p className="mt-3 capitalize-first line-clamp-6 sm:line-clamp-5 lg:line-clamp-none">{selectedBike.description}</p>
                        {selectedBike.price && <Button
                            className="rounded-full bg-theme-color absolute text-xl bottom-2 right-5 py-1"
                            onClick={() => history.push("/checkout")}
                        ><p>{`Rent for $${(Number(selectedBike.price).toFixed(0))}/hr`}</p><Arrow className="my-auto h-6 ml-3"/></Button>
                        }
                    </div>
                </div> : <Spinner />}
            </div>
        </div>


    );
}

BikeInfo.propTypes = {
    bike: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    bike: state.bike,
});

export default connect(mapStateToProps, { getBikeInfo })(BikeInfo);