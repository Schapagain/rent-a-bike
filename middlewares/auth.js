const njwt = require("njwt");
require("dotenv").config();
const signingKey = process.env.SECRET_KEY;
const {
  getError,
  ValidationError,
  NotAuthorizedError,
} = require("../controllers/errors");
const { getValidAuthMethods } = require("../controllers/auth");

const { ADMIN } = require("../controllers/roles");

/**
 * Verify that the role and id associated with the token
 * is allowed to access the attempted route
 * @param {String[]} allowedRoles
 */
function auth(allowedRoles) {
  return async function (req, res, next) {
    try {
      const token = parseAuthHeader(req.header("authorization"));
      const { id, role } = parseToken(token, signingKey);
      verifyRoutePermission(allowedRoles, role);
      if (role !== ADMIN) verifyRouteOwnership(req.params.id, id);

      // Inject userId into req before proceeding
      req.auth = { id, role };
      next();
    } catch (err) {
      next(await getError(err));
    }
  };
}

/**
 * Verify the given token, and return owner's id, role
 * @param {String} userToken
 * @param {String} signingKey
 */
function parseToken(userToken, signingKey) {
  const token = njwt.verify(userToken, signingKey);
  const id = token.body.sub;
  const role = token.body.scope;
  return { id, role };
}

/**
 * Ensure that users can only access their own resources
 * @param {String} ownerId
 * @param {String} id
 */
function verifyRouteOwnership(ownerId, id) {
  if (ownerId && id != ownerId) throw new NotAuthorizedError("Private route");
}

/**
 * Ensure that the role of the current user has permissions to this route
 * @param {String[]} allowedRoles
 * @param {String} role
 */
function verifyRoutePermission(allowedRoles, role) {
  if (!allowedRoles.includes(role)) throw new NotAuthorizedError("No access");
}

/**
 * Extracts user token from Authorization header
 * @param {String} authHeader
 */
function parseAuthHeader(authHeader) {
  const [authMethod, userToken] = authHeader ? authHeader.split(" ") : ["", ""];

  // ensure existence of auth method and token in correct format
  if (!userToken && !authMethod) throw new ValidationError("token");
  const methodIsValid = getValidAuthMethods().includes(
    authMethod.toLowerCase()
  );
  if (!authMethod || !methodIsValid)
    throw new ValidationError("token", "auth format not supported");
  if (!userToken) throw new ValidationError("token");

  return userToken;
}

module.exports = auth;
