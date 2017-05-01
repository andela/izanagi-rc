import { Template } from "meteor/templating";

Template.overview.onCreated(() => {
  this.state = new ReactiveDict();
  this.state.setDefault({});
});

Template.overview.helpers({
  totalSales() {
    return 0.00;
  },
  averageDailySales() {
    return 0;
  },
  ordersPlaced() {
    return 0;
  },
  itemsPurchased() {
    return 0;
  },
  shippingCharges() {
    return 0;
  }
});