/* eslint-disable no-undef */
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Cart } from "/lib/collections";
import { PaystackPayment } from "../../lib/collections/schemas";
import { Paystack } from "../../lib/api";
import "./paystack.html";
import "../../lib/api/paystackApi";

const enableButton = (template, buttonText) => {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
};

const paymentAlert = (template, errorMessage) => {
  return template.$(".alert").removeClass("hidden").text(errorMessage);
};

const handlePaystackSubmitError = (template, error) => {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  }
  return paymentAlert("Oops! " + error, null, 4);
};

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    Meteor.call("paystack/getKeys", (err, keys) => {
      const cart = Cart.findOne();
      const amount = Math.round(cart.cartTotal()) * 100;
      const template = this.template;
      const key = keys.public;
      const details = {
        key,
        name: doc.payerName,
        email: doc.payerEmail,
        reference: Random.id(),
        amount,
        callback(response) {
          const secret = keys.secret;
          const reference = response.reference;
          if (reference) {
            Paystack.verify(reference, secret, (error, res) => {
              if (error) {
                handlePaystackSubmitError(template, error);
                enableButton(template, "Resubmit payment");
              } else {
                const transaction = res.data;
                const paymentMethod = {
                  processor: "Paystack",
                  storedCard: transaction.authorization.card_type,
                  method: "credit",
                  transactionId: transaction.reference,
                  currency: transaction.currency,
                  amount: transaction.amount / 100,
                  status: "passed",
                  mode: "authorize",
                  createdAt: new Date(),
                  transactions: []
                };
                Alerts.toast("Transaction successful");
                paymentMethod.transactions.push(transaction.authorization);
                Meteor.call("cart/submitPayment", paymentMethod);
              }
            });
          }
        },
        onClose() {
          enableButton(template, "Complete payment");
        }
      };
      try {
        PaystackPop.setup(details).openIframe();
      } catch (error) {
        handlePaystackSubmitError(template, error);
        enableButton(template, "Complete payment");
      }
    });
    return false;
  }
});
