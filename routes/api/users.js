const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const formParser = require("../../middlewares/formParser");
const {
  signupUser,
  updateUser,
  deleteUser,
  getUsers,
  getIdCard,
} = require("../../controllers/users");
const { ADMIN, CUSTOMER } = require("../../controllers/roles");

/**
 * Route to fetch all users
 * @name api/users
 * @method GET
 * @access ADMIN
 * @inner
 * @param {string} path
 * @param {callback} middleware - Authenticate
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/", auth([ADMIN, CUSTOMER]), async (req, res) => {
  try {
    const query = req.auth.role === ADMIN ? {} : { id: req.auth.id };
    const result = await getUsers({ query, attributes: req.body.attributes });
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
 * Route to sigup a user
 * @name    api/users/signup
 * @method  POST
 * @access  Public
 * @inner
 * @param   {string} path
 * @param   {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.post("/signup", formParser, async (req, res) => {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: {
        field: err.field,
        msg: err.message,
      },
    });
  }
});

/**
 * Route to fetch user details
 * @name api/users/:id
 * @method GET
 * @access Public
 * @inner
 * @param {string} path
 * @param {callback} middleware - Authenticate
 * @param   {callback} middleware - Handle HTTP response
 */
router.get("/:id", auth([ADMIN, CUSTOMER]), async (req, res) => {
  try {
    const attributes = [
      "id",
      "name",
      "email",
      "phone",
      "organization",
      "employeeId",
      "idCard",
    ];
    let result = await getUsers({
      query: { id: req.params.id },
      attributes,
    });
    res.status(200).json(result);
  } catch (err) {
    return res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

/**
 * Route to update user info
 * @name    api/users/:id
 * @method  PATCH
 * @access  Private
 * @inner
 * @param   {string} path
 * @param   {callback} middleware - Authenticate
 * @param   {callback} middleware - Handle HTTP response
 */
router.patch("/:id", auth([ADMIN, CUSTOMER]), formParser, async (req, res) => {
  try {
    let result = await updateUser({ ...req.body, id: req.params.id });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.httpCode || 500).json({
      error: { msg: err.message },
    });
  }
});

/**
 * Route to delete a user
 * @name    api/users
 * @method  DELETE
 * @access  ADMIN
 * @inner
 * @param   {string} path
 * @param   {callback} middleware - Form Parser
 * @param   {callback} middleware - Handle HTTP response
 */
router.delete(
  "/:id",
  // auth([ADMIN]),
  formParser,
  async (req, res) => {
    try {
      const result = await deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      return res.status(err.httpCode || 500).json({
        error: { msg: err.message },
      });
    }
  }
);

module.exports = router;
