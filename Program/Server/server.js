const stripe = require("stripe")(
  "sk_test_51IHSuEA5rKg2mqjLuAthgOLQ0vHWniWkRJBk6Tqq1mPoeru40MRLhrbnrkIvQekkQsCnVTFVCjgRUbxgR2XdEBHe00MjGvsRSW"
);
const express = require("express");
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const YOUR_DOMAIN = "http://localhost:8100";
// const YOUR_DOMAIN = 'http://localhost:4242';

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions
    .create({
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
      success_url: `${YOUR_DOMAIN}/account?id=${session.id}`,
      cancel_url: `http://localhost:4242/cancel.html`,
    });

  // res.json({ id: session.id });
  res.send(JSON.stringify(session));
});

app.get("/validate", async (req, res) => {
  var session = req.query.id || "";
  console.log(session)
  const validate = await stripe.checkout.sessions
    .retrieve(session)
    .then((data) => {
      console.log(JSON.stringify(data.payment_status))
      res.send(JSON.stringify(data.payment_status)); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});
app.listen(4242, () => console.log("Running on port 4242"));
