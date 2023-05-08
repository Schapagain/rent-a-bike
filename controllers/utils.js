require('dotenv').config();
const { v4: uuid } = require('uuid');

/**
 * returns a random id of the given size 
 * (max=36,min=1)
 * @param {Number} size 
 */
function getRandomCode(size) {
    size = Math.max(1,Math.min(size,36))
    return uuid().slice(0, size);
}

/**
 * Return server address considering production status
 */
function getServerURL() {
    const production = 'https://cafe-rio.herokuapp.com';
    const development = 'http://localhost:5000';
    return process.env.NODE_ENV ? production : development;
}

/**
 * Remove ids from items if provided
 * @param {*} item 
 */
function trimPrematureIds(item) {
    delete item._id;
    delete item.id;
    return item;
  }

/**
 * Trim the given item to only include the given attributes
 * @param {*} item 
 */
function makeItem(item, attributes = ['id','name']) {
    return attributes.reduce((obj,attr) => ({...obj,[attr]:item[attr]}),{})
}

module.exports = {
    getRandomCode,
    getServerURL,
    trimPrematureIds,
    makeItem,
};