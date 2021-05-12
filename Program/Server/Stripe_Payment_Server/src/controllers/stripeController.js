const stripe = require("stripe")(
    "sk_test_51IHSuEA5rKg2mqjLuAthgOLQ0vHWniWkRJBk6Tqq1mPoeru40MRLhrbnrkIvQekkQsCnVTFVCjgRUbxgR2XdEBHe00MjGvsRSW"
  );
  
/** Creating a New Payment from Web */
export const createWebPayment = async (req, res) => {
  token = req.body.token;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "lkr",
          product_data: {
            name: "Application Fee",
          },
          unit_amount: 100 * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${APP_DOMAIN}/account?id={CHECKOUT_SESSION_ID}&token=${token}`,
    cancel_url: `${APP_DOMAIN}/account?id={CHECKOUT_SESSION_ID}&token=${token}`,
  });

  res.json({ id: session.id });
  // res.send(JSON.stringify(session));
};

/** Creating a New Payment from Office */
export const createOfficePayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100 * 100,
    currency: "lkr",
    payment_method_types: ["card"],
  });
  res.json({ client_secret: paymentIntent.client_secret });
};

/** Creating a New Payment from Kiosk */
export const createKioskPayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100 * 100,
    currency: "lkr",
    payment_method_types: ["card"],
  });
  res.json({ client_secret: paymentIntent.client_secret });
};

/** Validate payment*/
export const paymentValidate = async (req, res) => {
  var session = req.query.id || "";
  // console.log(session);
  const validate = await stripe.checkout.sessions
    .retrieve(session)
    .then((data) => {
      res.send(JSON.stringify(data.payment_status)); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
};

/** Check stripe balance and status */
export const stripeStatus = async (req, res) => {
  stripe.balance.retrieve(function (err, balance) {
    if (balance) {
      res.status(200).json({
        message: "Payment System Working",
        accountBalance: balance,
      });
    } else if (err) {
      res.status(500).json({
        message: "Payment System Down",
      });
    }
  });
};
