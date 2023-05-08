const { Bike } = require('./models');
const mockData = require('./bike_rental.json');

const bikeImages = [
  "https://res.cloudinary.com/skyimages/image/upload/v1683445288/ride-a-bike/large_bike_bg_zycbio.jpg",
  "https://res.cloudinary.com/skyimages/image/upload/v1683442497/ride-a-bike/helios_a8_om6sjx.png",
  "https://res.cloudinary.com/skyimages/image/upload/v1683424805/ride-a-bike/4876885_gzkuew.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683424733/ride-a-bike/4868533_y0athy.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683422448/ride-a-bike/default_bike_onqals.jpg",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/4888172_f8mj7k.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/4829653_sghy5z.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/AIXP20RZRS08G1_ofeyc7.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/6444552_qhvu4z.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/4904043_lwnnof.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/2022_WILDCAT_3_vtxjkp.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/2022_BOLINAS_RIDGE_2_oyv2wj.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/4888019_bps6l2.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683499108/ride-a-bike/2023_PATH_X4_qdgy4i.webp",
  "https://res.cloudinary.com/skyimages/image/upload/v1683422448/ride-a-bike/default_bike_onqals.jpg"
];

const bikeCategories = [
    "road",
    "kids",
    "city",
    "mountain",
    "electric",
    "bmx",
    "gravel",
];

const bikeFeatures = [
    "Lightweight carbon fiber frame",
    "Full suspension system with adjustable settings",
    "Hydraulic disc brakes provide powerful stopping power",
    "Comfortable geometry for long distance rides",
    "Aerodynamic design for maximum speed",
    "Electronic shifting for precise and effortless gear changes",
    "29-inch wheels for improved traction and control",
    "27.5-inch wheels for nimble handling on technical terrain",
    "Tubeless tires for reduced rolling resistance and improved puncture resistance",
    "Internal cable routing for a sleek and clean look",
    "Dropper seatpost for easy and quick saddle height adjustment",
    "Thru-axle hubs for improved stiffness and responsiveness",
    "Carbon fiber handlebars for reduced weight and improved vibration damping",
    "Suspension fork with lockout feature for efficient climbing",
    "Wide range cassette for easy climbing and fast descending",
    "Powerful hydraulic brakes for confident stopping ability",
    "Lightweight and durable aluminum frame",
    "Adjustable suspension system for custom tuning",
    "Comfortable saddle for long distance rides",
    "Wide handlebars for improved control and stability",
    "Carbon fiber rims for reduced weight and improved stiffness",
    "Shimano or SRAM drivetrain for reliable and smooth shifting",
    "Tapered head tube for improved steering precision",
    "Thru-axle rear dropout for improved stiffness and responsiveness",
    "Integrated chain guide for improved chain retention",
    "Wide range of available sizes for a perfect fit",
    "Pedals included for convenience",
    "High-volume tires for improved traction and stability",
    "Aggressive tread pattern for maximum grip on loose terrain",
    "Stout crankset for efficient power transfer",
    "Durable and reliable components for long-lasting performance",
    "Advanced suspension linkage for improved efficiency and control",
    "Adjustable suspension travel for a custom ride",
    "Low standover height for improved maneuverability",
    "Internal dropper post routing for a clean look",
    "Carbon fiber seatpost for reduced weight and improved vibration damping",
    "Boost hub spacing for improved wheel stiffness and compatibility",
    "Shimano or SRAM brakes for powerful and consistent stopping ability",
    "Chainstay protector for reduced chain slap and noise",
    "Tire inserts for improved puncture resistance",
    "Silent hub engagement for stealthy riding",
    "Titanium frame for ultimate durability and ride quality",
    "Single-speed drivetrain for simplicity and low maintenance",
    "Adjustable geometry for a custom ride experience",
    "Traction control technology for improved grip on loose terrain",
    "Custom paint and graphics for a unique look",
    "Fox or RockShox suspension components for world-class performance",
    "Carbon fiber stem for reduced weight and improved stiffness",
    "Saddle bag included for convenience",
    "Water bottle cage mounts for staying hydrated on long rides",
    "Carbon fiber cranks for reduced weight and improved stiffness",
    "Lightweight pedals for reduced rotational weight",
    "Wide platform pedals for improved stability and control",
    "Multi-tool included for trailside repairs",
    "Tubeless valve stems included for easy setup",
    "Carbon fiber chainstay protector for reduced chain slap and noise",
    "Flat mount disc brakes for improved braking performance",
    "Lock-on grips for secure and comfortable grip",
    "Cable actuated dropper post for reliable and easy operation",
    "Customizable suspension tuning for a perfect ride",
    "High-quality suspension bearings for smooth and reliable operation",
    "Sealed cartridge headset bearings for long-lasting performance",
    "Internal cable routing for a clean and sleek look",
    "Customizable frame and component colors",
  "Quick-release seatpost collar for easy saddle height adjustment",
  "Aerodynamic handlebar design for improved speed",
  "Wide range of gearing options for any terrain",
  "Lightweight and durable carbon fiber wheels",
  "Customizable suspension damping settings for ultimate control",
  "Adjustable stem angle for a perfect fit",
  "Wide range of tire widths for any terrain",
  "Internal cable routing for improved aerodynamics",
  "Tubeless-ready rims for easy tire setup",
  "Lightweight and durable titanium handlebars",
  "Carbon fiber headset spacers for reduced weight",
  "Customizable suspension spring rate for a perfect ride",
  "Shock absorption technology for improved comfort",
  "Low-friction chain for improved efficiency",
  "Carbon fiber bottle cage for reduced weight",
  "Customizable stem length for a perfect fit",
  "Adjustable suspension sag for a custom ride",
  "Integrated frame protection for improved durability",
  "Ultra-lightweight titanium bolts for reduced weight",
  "Customizable pedal spindle length for improved fit",
  "Tubeless sealant included for easy setup",
  "High-quality suspension pivot bearings for reliable operation",
  "Customizable brake lever reach for improved comfort",
  "Adjustable suspension volume spacers for a perfect ride",
  "Carbon fiber chain guide for reduced weight",
  "Anti-squat technology for improved pedaling efficiency",
  "Customizable rear shock air pressure for a perfect ride",
  "Shock tune database for easy setup",
  "Lightweight and durable aluminum wheels",
  "Carbon fiber headset for reduced weight and improved stiffness",
  "Internal dropper post routing for a clean look",
  "High-volume dropper post for easy saddle height adjustment",
  "Customizable suspension rebound damping for a perfect ride",
  "Wide range of handlebar widths for improved fit",
  "Customizable chainring size for any terrain",
  "Ultra-lightweight carbon fiber pedals",
  "Carbon fiber fork for reduced weight and improved stiffness",
  "Customizable cassette range for any terrain",
  "Low-profile chainstay for improved tire clearance",
  "Customizable pedal float for improved comfort",
  "Customizable rear shock compression damping for a perfect ride",
  "Tire inserts included for easy setup and improved puncture resistance",
  "Customizable brake rotor size for improved stopping power",
  "Carbon fiber headset cap for reduced weight and improved stiffness",
  "Customizable stem rise for a perfect fit",
  "Customizable rear shock lockout threshold for improved efficiency",
  "Adjustable tire pressure for improved traction and control",
  "Customizable suspension platform for improved pedaling efficiency",
  "Carbon fiber seatpost clamp for reduced weight and improved stiffness",
  "Low-profile rear dropout for improved frame clearance",
  "High-quality titanium frame hardware for reduced weight",
  "Carbon fiber derailleur hanger for reduced weight",
  "Carbon fiber headset spacer kit for reduced weight and improved stiffness",
  "Carbon fiber handlebar end plugs for reduced weight",
  "Customizable chainstay length for improved handling",
  "Low-friction derailleur cable for improved shifting performance"
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getUniqueRandomInts(num, min =  0, max = 100) {
    const res = new Set();
    while (res.size < num) {
        res.add(getRandomInt(min,max));
    }
    return Array.from(res);
  }

  function getRandomElementsFromArray(arr,num) {
    return getUniqueRandomInts(num,0,arr.length - 1).map(i=>arr[i]);
  }

function injectFeatures(allBikes) {
    // Insert variable number of random features into each bike object from the dataset
    allBikes.forEach(bike=> {
        bike.highlightedFeatures = getRandomElementsFromArray(bikeFeatures,getRandomInt(2,5));
        bike.category = getRandomElementsFromArray(bikeCategories,getRandomInt(1,4));
        bike.picture = getRandomElementsFromArray(bikeImages,1)[0];
    })
    return allBikes;
}

module.exports = async function() {

    const bikes = await Bike.find({});
    if (bikes.length > 0) return;

    console.log('database seeding started...')
    const seedBikes = injectFeatures(mockData);
    await Bike.deleteMany({});
    await Bike.insertMany(seedBikes);
    console.log('seeded database...');
}