const { Order, Bike } = require("../database/models");
const { queryDatabase } = require("../database");
const { getError, ValidationError, NotFoundError } = require("./errors");
const { trimPrematureIds, makeItem } = require("./utils");
const { deleteFiles } = require("./files");
const bike = require("../database/models/bike");
const { sendOrderConfirmation } = require("./email");

/**
 * Add a new order to the database
 * @param {{bikes: String[], amount: Number, user: String, paymentId: String}} order
 */
async function addOrder(order) {
  try {
    if (!order) throw new ValidationError("order");
    order = trimPrematureIds(order);
    const newOrder = await validateOrder(order,true);
    order = await newOrder.save();
    const populatedOrder = await order.populate('user',['name','email']).populate('bikes',["name","price"]).execPopulate();
    sendOrderConfirmation(populatedOrder);
    return { order: makeItem(order, ["id", "user", "bikes", "amount"]) };
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Validate the given order
 * @param {*} order
 */
async function validateOrder(order,final=false) {
  try {
    if (final) {
      if (!order.payment) throw new ValidationError("payment");
      if (!order.amount) throw new ValidationError("amount");
      if (!order.deliveryTime) throw new ValidationError("deliveryTime");
      if (!order.type) throw new ValidationError("type");
    }
    const newOrder = new Order(order);
    await newOrder.validate();
    return newOrder;
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Calculate gross total price for the bikes with given ids
 * @param {String[]} bikeIds
 */
async function calculateTotalAmount(bikeIds) {
  if (!bikeIds || !bikeIds.length) throw new ValidationError("bikes");
  const bikes = await Bike.find({ id: bikeIds });
  let bikePrices = {};
  bikes.forEach((bike) => {
    bikePrices[bike.id] = bike.price;
  });
  return bikeIds.reduce((s, id) => s + bikePrices[id], 0);
}

/**
 * Check if the order with the given parameters exists in the database
 * @param {object} query
 */
async function checkOrderPresence({ query, attributes = ["id"] }) {
  try {
    const exists = await queryDatabase({ model: Order, query, attributes });
    if (!exists || !exists.length) throw new NotFoundError("order");
    return exists;
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Get orders info from database
 * @param {String} id
 */
async function getOrders({
  attributes = ["id", "user", "bikes", "delivered","type","deliveryTime"],
  query = {},
}) {
  try {
    orders = await checkOrderPresence({ query, attributes });
    return {
      count: orders.length,
      data: orders.map((order) => makeItem(order, attributes)),
    };
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Remove order from the database
 * and order pictures from the disk
 * @param {String} id
 */
async function deleteOrder(id) {
  try {
    const order = await checkOrderPresence({ query: { id } });
    await Order.deleteOne({ id });
    deleteFiles(order.picture);
    return { id };
  } catch (err) {
    throw await getError(err);
  }
}

module.exports = {
  getOrders,
  addOrder,
  deleteOrder,
  validateOrder,
  calculateTotalAmount,
};
