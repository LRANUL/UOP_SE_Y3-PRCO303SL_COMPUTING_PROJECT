/** DEPRECATED VERSION v1*/

// const stripe = require("stripe")(
//   "sk_test_51IHSuEA5rKg2mqjLuAthgOLQ0vHWniWkRJBk6Tqq1mPoeru40MRLhrbnrkIvQekkQsCnVTFVCjgRUbxgR2XdEBHe00MjGvsRSW"
// );
// const express = require("express");
// const app = express();
// // app.use(express.static("."), express.json());
// var cors = require("cors");

// app.use(cors());
// // const APP_DOMAIN = "http://localhost:8100"; // ONLY DURING DEVELOPMENT
// // app.use(function (req, res, next) {
// //   res.header(
// //     "Access-Control-Allow-Origin",
// //     APP_DOMAIN,
// //   );
// //   res.header(
// //     "Access-Control-Allow-Headers",
// //     "Origin, X-Requested-With, Content-Type, Accept"
// //   );
// //   next();
// // });

// /**
//  * POST request to make a payment from Web app
//  * @api {post} /pay-nic
//  * @apiName Request an Web app based payment after payment validation will take place
//  * @apiGroup Payment
//  * @apiParam {token} body contains unique token.
//  * @apiSuccess token containg data for validation (200)
//  */
// app.post("/pay-nic", async (req, res) => {
//   token = req.body.token;
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "lkr",
//           product_data: {
//             name: "Application Fee",
//           },
//           unit_amount: 100 * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${APP_DOMAIN}/account?id={CHECKOUT_SESSION_ID}&token=${token}`,
//     cancel_url: `${APP_DOMAIN}/account?id={CHECKOUT_SESSION_ID}&token=${token}`,
//   });

//   res.json({ id: session.id });
//   // res.send(JSON.stringify(session));
// });
// /**
//  * POST request to make a payment from Officer / Secretary
//  * @api {post} /officer-pay-nic
//  * @apiName Request an Officer / Secretary based payment
//  * @apiGroup Payment
//  * @apiParam {token} body contains unique token.
//  * @apiSuccess Client secret (200)
//  */
// app.post("/officer-pay-nic", async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 100 * 100,
//     currency: "lkr",
//     payment_method_types: ["card"],
//   });
//   res.json({ client_secret: paymentIntent.client_secret });
// });
// /**
//  * POST request to make a payment from Kiosk
//  * @api {post} /kiosk-pay-nic
//  * @apiName Request an Kiosk based payment
//  * @apiGroup Payment
//  * @apiParam {token} body contains unique token.
//  * @apiSuccess Client secret (200)
//  */
// app.post("/kiosk-pay-nic", async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 100 * 100,
//     currency: "lkr",
//     payment_method_types: ["card"],
//   });
//   res.json({ client_secret: paymentIntent.client_secret });
// });
// /**
//  * GET request to validate a payment
//  * @api {get} /validate
//  * @apiName Request Payment status
//  * @apiGroup Payment
//  * @apiParam {token} body contains unique token.
//  * @apiSuccess paid or un_paid (200)
//  * @apiError Unable to reach server
//  */
// app.get("/validate", async (req, res) => {
//   var session = req.query.id || "";
//   // console.log(session);
//   const validate = await stripe.checkout.sessions
//     .retrieve(session)
//     .then((data) => {
//       res.send(JSON.stringify(data.payment_status)); // If no error occurs
//     })
//     .catch((err) => {
//       res.send(err); // If some error occurs
//     });
// });

// /**
//  * GET request to check Stripe status and balance
//  * @api {get} /stripe-status
//  * @apiName Request Payment and system status 
//  * @apiGroup Payment
//  * @apiParam {token} body contains unique token.
//  * @apiSuccess Payment System Working (200)
//  * @apiError Payment System Down (500)
//  */
//  app.get("/stripe-status", async (req, res) => {
//   stripe.balance.retrieve(function (err, balance) {
//       if (balance) {
//           res.status(200).json({
//               message: "Payment System Working",
//               accountBalance: balance
//           })
//       }
//       else if (err) {
//           res.status(500).json({
//               message: "Payment System Down",
//           })
//       }
//   });

// });

// // app.listen(4242, () => console.log("Running on port 5000"));
// app.listen(4242);
