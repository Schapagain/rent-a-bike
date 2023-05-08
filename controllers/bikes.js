const { Bike } = require("../database/models");
const { isValidMongooseId } = require("../database");
const { getError, ValidationError, NotFoundError } = require("./errors");
const { trimPrematureIds, makeItem } = require("./utils");
const { saveFiles, deleteFiles, updateFile } = require("./files");

/**
 * Add a new bike to the database
 * @param {*} bike
 */
async function addBike(bike) {
  try {
    if (!bike) throw new ValidationError("bike");
    bike = trimPrematureIds(bike);
    bike = await saveBikePicture(bike);
    newBike = new Bike(bike);
    bike = await newBike.save();
    return { bike: makeItem(bike, ["id", "name", "price", "category","picture"]) };
  } catch (err) {
    deleteFiles(bike.picture);
    throw await getError(err);
  }
}

/**
 * Update given properties for the bike
 * @param {*} bike
 */
async function updateBike(bike) {
  try {
    if (!bike) throw new ValidationError("bike");
    const oldBike = await checkBikePresence({ id: bike.id });
    bike = trimPrematureIds(bike);
    bike.picture = await updateBikePicture(oldBike.picture,bike.picture); 

    // update key values
    const keysToUpdate = Object.keys(bike);
    keysToUpdate.forEach((key) => {
      oldBike[key] = bike[key];
    });
    bike = await oldBike.save();
    return {
      bike: makeItem(bike, [
        "id",
        "name",
        "price",
        "category",
        ...keysToUpdate,
      ]),
    };
  } catch (err) {
    deleteFiles(bike.picture);
    throw await getError(err);
  }
}

/**
 * If a picture is provided, move it to storage
 * @param {*} bike
 */
async function saveBikePicture(bike) {
  if (bike.picture && typeof bike.picture == "object") {
    const pictureFileName = await saveFiles(bike.picture);
    bike.picture = pictureFileName;
  }
  return bike;
}

/**
 * replace the file at oldPictureUrl with the newPicture
 * return url to the updated picture 
 * @param {String} oldPictureUrl 
 * @param {File} newPicture 
 */
async function updateBikePicture(oldPictureUrl,newPicture) {
  if (newPicture && typeof newPicture == "object") {
    oldPictureUrl = updateFile(newPicture,oldPictureUrl);
  }
  return oldPictureUrl;
}

/**
 * Check if the bike with the given parameters exists in the database
 * @param {object} query
 */
async function checkBikePresence(query) {
  try {
    if (!query || (query.id && !isValidMongooseId(query.id))) {
      throw new NotFoundError("bike");
    }
    const exists = await Bike.findOne(query);
    if (!exists) throw new NotFoundError("bike");
    return exists;
  } catch (err) {
    throw await getError(err);
  }
}
/**
 * Get bikes info from database
 * @param {String} id
 */
async function getBikes(
  id = null,
  attributes = ["id", "name", "category", "price","picture","highlightedFeatures"],
  filters,
) {
  let bikes = [];
  if (!id) {

    const query = {};

    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
      const validQueries = ["color","available","material","category","min_price","max_price","brand"];
      validQueries.forEach(q=>{
        if (q in filters) {
          if (q === 'min_price') {
            query.price = {...(Object.assign({},query.price)),$gte : filters['min_price']}
          } else if (q === 'max_price') {
            query.price = {...(Object.assign({},query.price)),$lte : filters['max_price']}
          } else if (q === 'category' || q === 'color') {
            query[q] = { $in: filters[q].split(',')}
          } else {
            query[q] = filters[q];
          }
        }
      });
    }
    bikes = await Bike.find(query);
  } else {
    bikes = [await checkBikePresence({ id })];
  }
  return {
    count: bikes.length,
    data: bikes.map((bike) => makeItem(bike, attributes)),
  };
}

/**
 * Remove bike from the database
 * and bike pictures from the disk
 * @param {String} id
 */
async function deleteBike(id) {
  try {
    const bike = await checkBikePresence({ id });
    await Bike.deleteOne({ id });
    deleteFiles(bike.picture);
    return { id };
  } catch (err) {
    throw await getError(err);
  }
}

module.exports = { getBikes, addBike, updateBike, deleteBike };
