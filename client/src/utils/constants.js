export const ROOT_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://ride-a-bike.herokuapp.com"
    : "http://localhost:5000";

export const PAYMENT_STATUS = {
  success: "success",
  need_payment_method: "need payment method",
  load_checkout: "load checkout",
};
