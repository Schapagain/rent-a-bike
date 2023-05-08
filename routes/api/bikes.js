const express = require("express");
const router = express.Router();

const auth = require('../../middlewares/auth');
const formParser = require("../../middlewares/formParser");
const { getBikes, addBike, getPicture, updateBike, deleteBike } = require("../../controllers/bikes");
const { ADMIN } = require("../../controllers/roles");

/**
 * Route to fetch all bikes
 * @name api/bikes
 * @method GET
 * @access Public 
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/", async (req, res) => {

  try {
    const result = await getBikes(undefined,undefined,req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: {
        msg: err.message
      }
    })
  }
});

/**
 * Route to add a new bike
 * @name api/bikes
 * @method POST
 * @access Admin 
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/", auth([ADMIN]), formParser, async (req, res) => {

  try {
    const result = await addBike(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: {
        field: err.field,
        msg: err.message
      }
    })
  }
});

/**
 * Route to fetch bike details
 * @name api/bikes/:id
 * @method GET
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/:id", async (req, res) => {
  try {
    let result = await getBikes(req.params.id, ["id", "name", "brand", "material", "forkTravell", "suspensionTravel", "available", "category", "price", "picture", "description", "highlightedFeatures", "wheelSize", "color"]);
    res.status(200).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message }
    })
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
    res.status(200).sendFile(idPath, { root: '.' });
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message }
    })
  }
})

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
router.patch('/:id', auth([ADMIN]), formParser, async (req, res) => {
  try {
    let result = await updateBike({ ...req.body, id: req.params.id });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: { msg: err.message }
    })
  }
}
);

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
    const result = await deleteBike(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message }
    });
  }
});

module.exports = router;
