const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { validateOrder, calculateTotalAmount } = require("./orders");
const { ValidationError, getError } = require("./errors");

/**
 * Creates payment intent for the given order
 * @param {{bikes: String[],currency: String}} order
 * @param {String} currency
 */
async function createPaymentIntent(order, currency = "usd") {
  try {
    if (!order || !order.bikes || !order.user)
      throw new ValidationError("order");
    await validateOrder(order);
    const amount = await calculateTotalAmount(order.bikes);
    const intent = await getStripePaymentIntent({
      amount: amount * 100,
      currency,
    });
    return { amount, secret: intent.client_secret };
  } catch (err) {
    throw await getError(err);
  }
}

/**
 *
 * @param {{amount: Number,currency: String}}
 */
async function getStripePaymentIntent({ amount, currency = "usd" }) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ["card"],
  });
  return paymentIntent;
}

module.exports = {
  createPaymentIntent,
};
