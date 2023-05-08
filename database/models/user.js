const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: "Full name is required",
      trim: true,
      validate: {
        validator: async function (name) {
          return !name || name.split(" ").length > 1;
        },
        message: "Full name is required",
      },
    },
    organization: {
      type: String,
      required: "Organization is required",
    },
    employeeId: {
      type: String,
      required: "EmpoloyeeId is required",
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: "Phone is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address",
      ],
    },
    idCard: {
      type: String,
      required: "idCard is required",
    },
    password: {
      type: String,
      required: "Password is required",
    },
    activationCode: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Virtual to check if user has activated their account
 */
UserSchema.virtual("active").get(function () {
  return this.activationCode == null;
});

/**
 * Virtual to get registrationDate
 */
UserSchema.virtual("registrationDate").get(function () {
  return this.createdAt;
});

/**
 * Hash password and save id before saving user
 */
UserSchema.pre("save", async function (next) {
  let user = this;

  // save id
  user.id = this._id;

  // hash password
  if (!user.isModified("password")) return next();
  user.password = await generatePasswordHash(user.password);
  return next();
});

/**
 * Provide an API to compare passwords
 * @param {String} candidatePassword
 */
UserSchema.methods.validatePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Convert the given plaintext password to a hash
 * @param {String} passwordPlain
 */
async function generatePasswordHash(passwordPlain) {
  try {
    const saltRounds = 5;
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);
    return passwordHash;
  } catch (err) {
    throw err;
  }
}

module.exports = User = mongoose.model("User", UserSchema);
