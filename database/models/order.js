const mongoose = require("mongoose");
const User = require("./user");
const Bike = require("./bike");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "user id is required",
    validate: {
      validator: async function (id) {
        const count = await User.countDocuments({ id });
        return count > 0;
      },
      message: "invalid user id",
    },
  },
  bikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bike",
      required: "array of bike ids is required",
      validate: {
        validator: async function (id) {
          const count = await Bike.countDocuments({ id });
          return count > 0;
        },
        message: "Invalid array of bike ids",
      },
    },
  ],
  amount: {
    type: Number,
  },
  payment: {
    type: String,
    validate: {
      validator: verifyStripePaymentMethod,
      message: "Payment could not be verified",
    },
  },
  type: {
    type: String,
    validate: {
      validator : function (type) {
        return ["dinein","delivery","takeout"].includes(type);
      },
      message: "Type has to be one of: dinein, delivery or takeout"
    }
  },
  deliveryTime: {
    type: Date,
    validate: {
      validator: function (time) {
        return time >= Date.now();
      },
      message: "delivery time cannot be in the past"
    }
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

/**
 * save id before saving order
 */
OrderSchema.pre("save", async function (next) {
  let order = this;
  order.id = this._id;
  return next();
});

/**
 * Verify the given paymentId (payment method id)
 * @param {String} paymentId
 */
async function verifyStripePaymentMethod(paymentId) {
  try {
    if (!paymentId) return false;
    await stripe.paymentMethods.retrieve(paymentId);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = Order = mongoose.model("Order", OrderSchema);
