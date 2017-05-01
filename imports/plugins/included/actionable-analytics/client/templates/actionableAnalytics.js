import _ from "lodash";
import { Template } from "meteor/templating";
import { Orders } from "/lib/collections";
import { formatPriceString } from "/client/api";

/**
 * Function to fetch the total of all sales made
 * @param {Array} allOrders - Array containing all the orders
 * @return {Object} - an Object containing the necessary overview details
 */
function extractOverviewItems(allOrders) {
  let totalSales = 0;
  let totalItemsPurchased = 0;
  let totalShippingCost = 0;
  const analytics = {};
  allOrders.forEach((order) => {
    totalSales += order.billing[0].invoice.subtotal;
    totalItemsPurchased += order.items.length;
    totalShippingCost += order.billing[0].invoice.shipping;
    order.items.forEach((item) => {
      if (analytics[item.title]) {
        analytics[item.title].quantitySold += item.quantity;
        analytics[item.title].totalSales += item.variants.price;
      } else {
        analytics[item.title] = {
          quantitySold: item.quantity,
          totalSales: item.variants.price
        };
      }
    });
  });

  const latestOrder = _.maxBy(allOrders, (order) => {
    return Date.parse(order.createdAt);
  });
  const oldestOrder = _.minBy(allOrders, (order) => {
    return Date.parse(order.createdAt);
  });
  const difference = daysDifference(Date.parse(oldestOrder.createdAt), Date.parse(latestOrder.createdAt));
  const salesPerDay = totalSales / difference;
  return {totalSales, totalItemsPurchased, totalShippingCost, salesPerDay, analytics};
}


/**
 * Helper function to fetch the total number of items purchased
 * from all orders
function extractTotalItemsPurchased(allOrders) {
  let totalItems = 0;
  allOrders.forEach((order) => {
    totalItems += order.items.length;
  });
  return totalItems;
}
*/

/**
 * Helper function to calculate the differnce (in days)
 * between 2 dates
 * @param{Object} date1 - older date1 in milliseconds
 * @param{Object} date2 - recent date in milliseconds
 * @return{Number} - Difference between date2 and date1 in days (Number of days between date2 and date1)
 */
function daysDifference(date1, date2) {
  // a Day represented in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;
  // Calculate the difference in milliseconds
  const difference = date2 - date1;
  // Convert back to days and return
  return Math.round(difference / oneDay);
}

Template.actionableAnalytics.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    ordersPlaced: 0,
    totalSales: 0,
    totalItemsPurchased: 0,
    totalShippingCost: formatPriceString(0),
    salesPerDay: 0, 
    analytics: {}
  });
  this.autorun(() => {
    const sub = this.subscribe("Orders");
    if (sub.ready()) {
      const allOrders = Orders.find().fetch();
      const overviewItems = extractOverviewItems(allOrders);
      this.state.set("ordersPlaced", allOrders.length);
      this.state.set("totalSales", overviewItems.totalSales);
      this.state.set("totalItemsPurchased", overviewItems.totalItemsPurchased);
      this.state.set("salesPerDay", formatPriceString(overviewItems.salesPerDay));
      this.state.set("totalShippingCost", formatPriceString(overviewItems.totalShippingCost));
      this.state.set("analytics", overviewItems.analytics);
    }
  });
});

Template.actionableAnalytics.helpers({
  ordersPlaced() {
    const instance = Template.instance();
    const orders = instance.state.get("ordersPlaced");
    return orders;
  },
  totalSales() {
    const instance = Template.instance();
    return formatPriceString(instance.state.get("totalSales"));
  },
  totalItemsPurchased() {
    const instance = Template.instance();
    return instance.state.get("totalItemsPurchased");
  },
  totalShippingCost() {
    const instance = Template.instance();
    return instance.state.get("totalShippingCost");
  },
  salesPerDay() {
    const instance = Template.instance();
    return instance.state.get("salesPerDay");
  },
  bestSelling() {
    const products = [];
    const instance = Template.instance();
    const analytics = instance.state.get("analytics");
    for (key in analytics) {
      if (key) {
        products.push({
          product: key,
          quantitySold: analytics[key].quantitySold
        });
      }
    }
    return _.orderBy(
      products,
      (product) => {
        return product.quantitySold;
      },
      "desc"
    );
  },
  topEarning() {
    const products = [];
    const instance = Template.instance();
    const analytics = instance.state.get("analytics");
    for (key in analytics) {
      if (key) {
        products.push({
          product: key,
          salesSorter: analytics[key].totalSales,
          totalSales: formatPriceString(analytics[key].totalSales)
        });
      }
    }
    return _.orderBy(
      products,
      (product) => {
        return product.salesSorter;
      },
      "desc"
    );
  }
});
