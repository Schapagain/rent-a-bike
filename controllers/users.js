const { isValidMongooseId, queryDatabase } = require("../database");

// Import the user model
const { User } = require("../database/models");
const { getError, ValidationError, NotFoundError } = require("./errors");
const { saveFiles, deleteFiles } = require("./files");
const { sendActivationEmail } = require("./email");
const {
  getRandomCode,
  getServerURL,
  trimPrematureIds,
  makeItem,
} = require("./utils");

/**
 * Save user info to the database
 * and user files into the disk
 * @param {*} user
 */
async function signupUser(user) {
  try {
    checkIdCardPresence(user);
    user = trimPrematureIds(user);
    user = await saveUserIdCard(user);
    const newUser = new User(user);
    user = await newUser.save();

    // generate activation link for the user and send email
    const activationLink = generateActivationLink(user);
    sendActivationEmail(user.name, user.email, activationLink);

    return { user: makeItem(user, ["id", "name", "email"]) };
  } catch (err) {
    if (user.idCard) deleteFiles(user.idCard);
    throw await getError(err);
  }
}

/**
 * If an id card is provided, move it to storage
 * @param {*} user
 */
async function saveUserIdCard(user) {
  if (user.idCard && typeof user.idCard == "object") {
    const pictureFileName = await saveFiles(user.idCard);
    user.idCard = pictureFileName;
  }
  return user;
}

/**
 * replace the file at oldPictureUrl with the newPicture
 * return url to the updated picture
 * @param {String} OldIdUrl
 * @param {File} newId
 */
async function updateUserIdCard(oldIdUrl, newId) {
  if (newId && typeof newId == "object") {
    oldIdUrl = updateFile(newId, oldIdUrl);
  }
  return oldIdUrl;
}

/**
 * Update given properties for the user
 * @param {*} user
 */
async function updateUser(user) {
  try {
    if (!user) throw new ValidationError("user");
    const oldUser = await checkUserPresence({ query: { id: user.id } });
    user = trimPrematureIds(user);
    user.idCard = await updateUserIdCard(oldUser.idCard, user.idCard);

    // update key values
    let keysToUpdate = Object.keys(user);
    keysToUpdate.forEach((key) => {
      oldUser[key] = user[key];
    });
    user = await oldUser.save();

    // do not return password in response
    keysToUpdate = keysToUpdate.filter((key) => key !== "password");
    return { user: makeItem(user, ["id", "name", "email", ...keysToUpdate]) };
  } catch (err) {
    deleteFiles(user.picture);
    throw await getError(err);
  }
}

/**
 * Generate an activation link for the new user
 * @param {*} user
 */
function generateActivationLink(user) {
  const activationCode = generateActivationCode(user);
  return getServerURL().concat("/api/auth/activate/", activationCode);
}

/**
 * Generate a random code and persist it as activationCode
 * @param {*} user
 */
function generateActivationCode(user) {
  const activationCode = getRandomCode(10);
  user.activationCode = activationCode;
  user.save();
  return activationCode;
}

/**
 * Check if idCard property exists on user
 * @param {Object} user
 */
function checkIdCardPresence(user) {
  if (!user.idCard || !(typeof user.idCard == "object")) {
    if (user.idCard === "null" || user.idCard === "undefined")
      user.idCard = null;
    throw new ValidationError("idCard", "Upload a picture of an Id card");
  }
}

/**
 * Remove user from the database
 * and user files from the disk
 * @param {*} user
 */
async function deleteUser(id) {
  try {
    const user = await checkUserPresence({ query: { id } });
    await User.deleteOne({ id });
    deleteFiles(user.idCard);
    return { id };
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Check if the user with the given parameters exists in the database
 * @param {object} query
 * @param {String[]} attributes
 */
async function checkUserPresence({ query, attributes = ["id"] }) {
  try {
    const users = await queryDatabase({ model: User, query, attributes });
    if (!users || !users.length) throw new NotFoundError("user");
    return users;
  } catch (err) {
    throw await getError(err);
  }
}
/**
 * Get users info from database
 * @param {Object} query
 * @param {String[]} attributes
 */
async function getUsers({
  query,
  attributes = ["id", "name", "email", "phone", "organization", "idCard"],
}) {
  let users;
  try {
    if (!query || !query.id) {
      users = await queryDatabase({ model: User, query, attributes });
    } else {
      users = await checkUserPresence({ query, attributes });
    }
  } catch (err) {
    throw await getError(err);
  }

  return { count: users.length, data: users };
}

module.exports = {
  signupUser,
  updateUser,
  deleteUser,
  getUsers,
  checkUserPresence,
};
