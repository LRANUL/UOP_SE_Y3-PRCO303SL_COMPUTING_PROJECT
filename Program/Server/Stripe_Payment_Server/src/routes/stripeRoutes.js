import {
    createWebPayment,
    createOfficePayment,
    createKioskPayment,
    paymentValidate,
    stripeStatus
  } from "../controllers/stripeController";
  
  const routes = (app) => {
  
    /** Payment Manage Routes */
    
    // For creating a payment via web app
    app.route("/pay-nic").post(createWebPayment);
    // For creating a payment via web app
    app.route("/officer-pay-nic").post(createOfficePayment);
    // For creating a payment via web app
    app.route("/kiosk-pay-nic").post(createKioskPayment);
   // For checking a payment status
   app.route("/validate").get(paymentValidate);
   // For checking a stripe status
   app.route("/stripe-status").get(stripeStatus);
  };
  
  export default routes;