const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BikeSchema = new Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        required: 'Name of the bike is required',
        trim: true,
    },
    highlightedFeatures: {
        type: [String],
    },
    brand: {
        type: String,
        default: "N/A"
    },
    price: {
        type: Number,
        required: "Price of the bike is required",
    },
    category: {
        type: [String],
    },
    material: {
        type: String,
        required: "Material for the bike is requirerd"
    },
    forkTravel: {
        type: String
    },
    suspensionTravel: {
        type: String,
    },
    wheelSize: {
        type: String,
        default: "N/A"
    },
    color: {
        type: [String],
    },
    description: {
        type: String,
    },
    available: {
        type: Boolean,
        default: true,
    },
    picture: {
        type: String,
        default: "https://res.cloudinary.com/skyimages/image/upload/v1683422448/ride-a-bike/default_bike_onqals.jpg"
    }
});

/**
 * save id before saving bike
 */
BikeSchema.pre('save', async function (next) {
    let bike = this;
    bike.id = this._id;
    return next();
})

BikeSchema.post('insertMany', async function (docs, next) {
    if (Array.isArray(docs) && docs.length) {
        docs.forEach(doc => {
            doc.save();
        })
    }
    return next();
})

module.exports = Bike = mongoose.model('Bike', BikeSchema);