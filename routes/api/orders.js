const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const formParser = require("../../middlewares/formParser");
const {
  getOrders,
  addOrder,
  deleteOrder,
} = require("../../controllers/orders");
const { ADMIN, CUSTOMER } = require("../../controllers/roles");
const { createPaymentIntent } = require("../../controllers/payments");

/**
 * Route to fetch all orders
 * @name api/orders
 * @method GET
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/", async (req, res) => {
  try {
    const result = await getOrders({ queries: { ...req.query } });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: {
        msg: err.message,
      },
    });
  }
});

/**
 * Route to create a payment-intent
 * @name api/orders/create_intent
 * @method POST
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/create_intent", auth([ADMIN, CUSTOMER]), async (req, res) => {
  try {
    const user = req.auth.role === ADMIN ? req.body.user : req.auth.id;
    const result = await createPaymentIntent({ ...req.body, user });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: {
        field: err.field,
        msg: err.message,
      },
    });
  }
});

/**
 * Route to add a new order
 * @name api/orders
 * @method POST
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/", auth([ADMIN, CUSTOMER]), async (req, res) => {
  try {
    const user = req.auth.role === ADMIN ? req.body.user : req.auth.id;
    const result = await addOrder({ ...req.body, user });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: {
        field: err.field,
        msg: err.message,
      },
    });
  }
});

/**
 * Route to fetch order details
 * @name api/orders/:id
 * @method GET
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/:id", async (req, res) => {
  try {
    let result = await getOrders({ query: { id: req.params.id } });
    res.status(200).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

/**
 * Route to fetch bike picture
 * @name api/bikes/:id/picture
 * @method Get
 * @access Public
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/:id/picture", async (req, res) => {
  try {
    const idPath = await getPicture(req.params.id);
    res.status(200).sendFile(idPath, { root: "." });
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

/**
 * Route to update a bike
 * @name    api/bikes/:id
 * @method  PATCH
 * @access  Admin
 * @inner
 * @param   {string} path
 * @param   {callback} middleware - Authenticate
 * @param   {callback} middleware - Handle HTTP response
 */
router.patch("/:id", auth([ADMIN]), formParser, async (req, res) => {
  try {
    let result = await updateBike({ ...req.body, id: req.params.id });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

/**
 * Route to delete a bike
 * @name    api/bikes/:id
 * @method  DELETE
 * @access  Admin
 * @inner
 * @param   {string} path
 * @param   {callback} middleware - Authenticate
 * @param   {callback} middleware - Handle HTTP response
 */
router.delete("/:id", auth([ADMIN]), async (req, res) => {
  try {
    const result = await deleteOrder(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

module.exports = router;
