const mongoose = require("mongoose");
const { ValidationError } = require("../controllers/errors");
require("dotenv").config();
const seedDB = require('./seed');
const mongoURI = `mongodb+srv://sandesh:${process.env.DBPASSWORD}@mongo-aws.bav9k.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedDB();
  })
  .catch((err) => console.log(err));

/**
 * Check if the given id is a valid Mongoose id
 * @param {String} id
 */
const isValidMongooseId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Find from the given model, using given query filters and attributes
 * @param {mongoose.Model} model
 * @param {Object} query
 * @param {String []} attributes
 */
const queryDatabase = async ({ model, query, attributes }) => {
  if (query && query.id && !isValidMongooseId(query.id)) {
    throw new ValidationError("id");
  }
  return model.find(query, "-_id ".concat(attributes.join(" ")));
};


/* Used to seed if DB is empty */
const seedBikes = [{

}]

module.exports = {
  isValidMongooseId,
  queryDatabase,
};
