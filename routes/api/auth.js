const express = require("express");
const router = express.Router();

const formParser = require("../../middlewares/formParser");
const {
  authenticate,
  activateAccount,
  authenticateAdmin,
} = require("../../controllers/auth");
const rootEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://cafe-rio.netlify.app"
    : "http://localhost:3000";
const appAddress = rootEndpoint;

/**
 * Route to active account
 * @name api/auth/activate
 * @method POST
 * @access Public
 * @inner
 * @param {string} path
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/activate/:activationCode", async (req, res) => {
  console.log('activating::',req.params)
  try {
    await activateAccount(req.params.activationCode);
    res.redirect(appAddress);
  } catch (err) {
    res.redirect(appAddress);
  }
});

/**
 * Route to authenticate admin credentials
 * @name api/auth/admin
 * @method POST
 * @access Public
 * @inner
 * @param {string} path
 * @param {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/admin", formParser, async (req, res) => {
  try {
    const result = await authenticateAdmin(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({ error: err.message });
  }
});

/**
 * Route to authenticate credentials
 * @name api/auth
 * @method POST
 * @access Public
 * @inner
 * @param {string} path
 * @param {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/", formParser, async (req, res) => {
  try {
    const result = await authenticate(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({ error: err.message });
  }
});

module.exports = router;
