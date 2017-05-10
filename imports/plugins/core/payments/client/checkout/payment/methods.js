import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Shops, Wallets, Cart } from "/lib/collections";
import "./methods.html";

Template.corePaymentMethods.helpers({
  enabledPayments
});

Template.corePaymentMethods.onCreated(function () {
  const payments = enabledPayments();
  const paymentsEnabled = payments.length;
  // If no payments enabled, show payments settings dashboard
  if (!paymentsEnabled) {
    openActionView();
  }
});

Template.corePaymentMethods.events({
  "click [data-event-action=configure-payment-methods]"(event) {
    event.preventDefault();
    openActionView();
  }
});

function enabledPayments() {
  const enabledPaymentsArr = [];
  const apps = Reaction.Apps({
    provides: "paymentMethod",
    enabled: true
  });
  for (app of apps) {
    if (app.enabled === true) enabledPaymentsArr.push(app);
  }
  return enabledPaymentsArr;
}

function openActionView() {
  const dashboardRegistryEntry = Reaction.Apps({ name: "reaction-dashboard", provides: "shortcut" });
  const paymentRegistryEntry = Reaction.Apps({ name: "reaction-payments", provides: "settings" });

  Reaction.showActionView([
    dashboardRegistryEntry[0],
    paymentRegistryEntry[0]
  ]);
}

Template.walletPayment.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.setDefault({
      details: {balance: 0}
    });
    this.subscribe("transactionDetails", Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    this.state.set("details", transactionInfo[0]);
  });
});

Template.walletPayment.helpers({
  balance: () => {
    return Template.instance().state.get("details").balance;
  }
});

Template.walletPayment.events({
  "click #pay-with-wallet": (event) => {
    event.preventDefault();
    const balance = Template.instance().state.get("details").balance;
    const cartAmount = parseInt(Cart.findOne().cartTotal(), 10);
    if (cartAmount > balance) {
      Alerts.toast("Insufficient balance", "error");
      return false;
    }
    const currency = Shops.findOne().currency;
    transactionId = Random.id();
    Meteor.call("wallet/transaction", Meteor.userId(), {
      amount: cartAmount,
      date: new Date(),
      orderId: transactionId,
      transactionType: "Debit"
    }, (err, res) => {
      if (res) {
        const paymentMethod = {
          processor: "Wallet",
          storedCard: "",
          method: "credit",
          transactionId,
          currency: currency,
          amount: cartAmount,
          status: "passed",
          mode: "authorize",
          createdAt: new Date(),
          transactions: []
        };
        const theTransaction = {
          amount: cartAmount,
          transactionId,
          currency: currency
        };
        paymentMethod.transactions.push(theTransaction);
        Meteor.call("cart/submitPayment", paymentMethod);
        Alerts.toast("Payment Successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    });
  }
});
