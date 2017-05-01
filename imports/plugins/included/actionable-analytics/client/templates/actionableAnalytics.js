import _ from "lodash";
import { Template } from "meteor/templating";
import { Orders, ProductSearch } from "/lib/collections";
import { formatPriceString } from "/client/api";
import { ReactiveDict } from "meteor/reactive-dict";

/**
 * Function to fetch the total of all sales made
 * @param {Array} allOrders - Array containing all the orders
 * @return {Object} - an Object containing the necessary overview details
 */
function extractAnalyticsItems(allOrders) {
  let totalSales = 0;
  let totalItemsPurchased = 0;
  let totalShippingCost = 0;
  const analytics = {};
  const analyticsStatement = {};
  const ordersAnalytics = [];
  allOrders.forEach((order) => {
    const orderDate = order.createdAt;
    const dateString = orderDate.toISOString().split("T")[0];
    ordersAnalytics.push({
      date: dateString,
      country: order.billing[0].address.region,
      city: order.billing[0].address.city,
      paymentProcessor: order.billing[0].paymentMethod.processor,
      shipping: order.billing[0].invoice.shipping,
      taxes: order.billing[0].invoice.taxes
    });
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
      const uniqueStamp = `${dateString}::${item.title}`;
      if (analyticsStatement[uniqueStamp] && analyticsStatement[uniqueStamp].title === item.title) {
        analyticsStatement[uniqueStamp].totalSales += item.variants.price;
        analyticsStatement[uniqueStamp].quantity += item.quantity;
      } else {
        analyticsStatement[uniqueStamp] = {
          title: item.title,
          quantity: item.quantity,
          dateString,
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
  let salesPerDay = 0;
  if (oldestOrder && latestOrder) {
    const difference = daysDifference(Date.parse(oldestOrder.createdAt), Date.parse(latestOrder.createdAt));
    salesPerDay = difference === 0 ? totalSales : totalSales / difference;
  }
  return {totalSales, totalItemsPurchased, totalShippingCost, salesPerDay, analytics, analyticsStatement, ordersAnalytics};
}

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
    totalShippingCost: 0,
    salesPerDay: 0,
    analytics: {},
    analyticsStatement: {},
    ordersAnalytics: [],
    productsAnalytics: []
  });
  this.autorun(() => {
    const orderSub = Meteor.subscribe("Orders");
    const productSub = Meteor.subscribe("searchresults/actionableAnalytics");
    if (orderSub.ready()) {
      const allOrders = Orders.find().fetch();
      if (allOrders) {
        const analyticsItems = extractAnalyticsItems(allOrders);
        this.state.set("ordersPlaced", allOrders.length);
        this.state.set("totalSales", analyticsItems.totalSales);
        this.state.set("totalItemsPurchased", analyticsItems.totalItemsPurchased);
        this.state.set("salesPerDay", analyticsItems.salesPerDay);
        this.state.set("totalShippingCost", analyticsItems.totalShippingCost);
        this.state.set("analytics", analyticsItems.analytics);
        this.state.set("analyticsStatement", analyticsItems.analyticsStatement);
        this.state.set("ordersAnalytics", analyticsItems.ordersAnalytics);
      }
      orderSub.stop();
      if (productSub.ready()) {
        const products = ProductSearch.find({isVisible: true}, {
          views: 1,
          title: 1,
          quantitySold: 1
        }).fetch();
        if (products) {
          this.state.set("productsAnalytics", products);
        }
      }
      productSub.stop();
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
    return formatPriceString(instance.state.get("totalShippingCost"));
  },
  salesPerDay() {
    const instance = Template.instance();
    return formatPriceString(instance.state.get("salesPerDay"));
  },
  bestSelling() {
    const products = [];
    const instance = Template.instance();
    const analytics = instance.state.get("analytics");
    for (const key in analytics) {
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
    for (const key in analytics) {
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
  },
  statements() {
    const statements = [];
    const instance = Template.instance();
    const analyticsStatement = instance.state.get("analyticsStatement");
    for (const key in analyticsStatement) {
      if (key) {
        statements.push(analyticsStatement[key]);
        analyticsStatement[key].totalSales = formatPriceString(analyticsStatement[key].totalSales);
      }
    }
    return _.orderBy(
      statements,
      (statement) => {
        return Date.parse(statement.dateString);
      },
      "desc");
  },
  orders() {
    const instance = Template.instance();
    const orders = instance.state.get("ordersAnalytics");
    return _.orderBy(
      orders,
      (order) => {
        order.taxes = formatPriceString(order.taxes);
        order.shipping = formatPriceString(order.shipping);
        return Date.parse(order.date);
      },
      "desc"
    );
  },
  products() {
    const instance = Template.instance();
    const productsAnalytics = instance.state.get("productsAnalytics");
    return _.orderBy(productsAnalytics,
      (product) => {
        return product.views;
      },
      "desc"
    );
  }
});
