/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "PaystackPayment",
  name: "paystack",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    "mode": false,
    "apiKey": "",
    "example": {
      enabled: false
    },
    "paystack": {
      enabled: false
    }
  },
  registry: [
    // Settings panel
    {
      label: "Paystack Payment Settings", // this key (minus spaces) is used for translations
      provides: "paymentSettings",
      container: "dashboard",
      template: "paystackSettings"
    },

    // Payment form for checkout
    {
      template: "paystackPaymentForm",
      provides: "paymentMethod",
      icon: "fa fa-credit-card-alt"
    }
  ]
});
