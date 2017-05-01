import moment from "moment";
import { Template } from "meteor/templating";
import { Orders, Shops } from "/lib/collections";
import { i18next } from "/client/api";

/**
 * dashboardOrdersList helpers
 *
 */
Template.dashboardOrdersList.helpers({
  orderStatus() {
    if (this.workflow.status === "coreOrderWorkflow/completed") {
      return i18next.t("order.completed");
    } else if (this.workflow.status === "cancelled") {
      return "Cancelled";
    }
    return i18next.t("order.processing");
  },
  orders(data) {
    if (data.hash.data) {
      return data.hash.data;
    }
    return Orders.find({}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });
  },
  orderAge() {
    return moment(this.createdAt).fromNow();
  },
  shipmentTracking() {
    return this.shipping[0].shipmentMethod.tracking;
  },
  shopName() {
    const shop = Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  },
  hasComment() {
    return this.comment !== "Select One";
  }
});
