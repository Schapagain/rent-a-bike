const { getError } = require("./errors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const moment = require("moment");
/**
 * Use google client info in the environment
 * to creaet nodemailer transporter
 */
async function getGoogleMailTransporter() {
  const user = process.env.EMAILUSER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: appPassword,
      },
    });
  } catch (err) {
    throw await getError(err);
  }
  return transporter;
}

/**
 * Send activationLink to the user using gmail server
 * @param {String} name
 * @param {String} email
 * @param {String} activationLink
 */
async function sendActivationEmail(name, email, activationLink) {
  try {
    let transporter = await getGoogleMailTransporter();
    const mailBody = getEmailBody(
      process.env.EMAILUSER,
      email,
      name,
      activationLink
    );
    transporter.sendMail(mailBody);
  } catch (err) {
    throw await getError(err);
  }
}

/**
 * Make an email body (for activation email) given sender and receiver info
 * @param {String} senderEmail
 * @param {String} receiverEmail
 * @param {String} receiverName
 * @param {String} activationLink
 */
function getEmailBody(
  senderEmail,
  receiverEmail,
  receiverName,
  activationLink
) {
  let mailBody = {
    from: `"Cafe Rio" <${senderEmail}>`,
    to: receiverEmail,
    subject: "Activate account",
    text: `Hello ${receiverName}, welcome to Cafe Rio. Please click on the following link to activate your account: ${activationLink}`, // plain text body
    html: `<h2>Hello ${receiverName}</h2>
    <p>Welcome to Cafe Rio. 
    Please click on the following link to activate your account: <p>
    <a href = ${activationLink} >Activate account</a>
    `,
  };
  return mailBody;
}

async function sendOrderConfirmation(order) {
  try {
    let transporter = await getGoogleMailTransporter();
    const mailBody = getConfirmationBody(order);
    transporter.sendMail(mailBody);
  } catch (err) {
    throw await getError(err);
  }
}

function getConfirmationBody(order) {
  const senderEmail = process.env.EMAILUSER;
  const { bikes, user, amount } = order;
  const table = getBikesTable(bikes, amount);

  const style = `
  <style>
  th, td {
    padding: 5px;
  }
  th {
    text-align: left;
  }
  </style>
  `;
  let mailBody = {
    from: `"Cafe Rio" <${senderEmail}>`,
    to: user.email,
    subject: "Order confirmation",
    html: `${style}<h2> Hello ${user.name}</h2>
    <p> Here's a summary of your order:</p>
    ${table}
    <p> The order will be ready around ${moment(order.deliveryTime).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    )}</p>
    `,
  };
  return mailBody;
}

function getBikesTable(bikes, amount) {
  let table = `<table style="width:500px">
  <tr>
    <th>Bike</th>
    <th>Price</th>
  </tr>`;
  for (let bike of bikes) {
    table += `<tr> <td> ${bike.name} </td> <td>$${bike.price.toFixed(
      2
    )} </td> </tr>`;
  }
  table += `<tr><td>Total</td><td>$${amount.toFixed(2)}</td></tr>`;
  return (table += "</table>");
}

module.exports = { sendActivationEmail, sendOrderConfirmation };
