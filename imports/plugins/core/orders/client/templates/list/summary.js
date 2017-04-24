import { NumericInput } from "/imports/plugins/core/ui/client/components";
import { Logger } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api/index";
import { ReactiveDict } from "meteor/reactive-dict";


Template.ordersListSummary.onCreated(function () {
  this.state = new ReactiveDict();

  this.autorun(() => {
    const currentData = Template.currentData();
    const order = currentData.order;
    this.state.set("order", order);
  });
});

/**
 * ordersListSummary helpers
 *
 * @returns paymentInvoice
 */
Template.ordersListSummary.helpers({
  invoice() {
    return this.invoice;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;

    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  },

  displayCancelButton() {
    return !(this.order.workflow.status === "cancelled"
      || this.order.workflow.status === "coreOrderWorkflow/completed" || Reaction.hasPermission("admin"));
  },

  orderStatus() {
    return this.order.workflow.status === "cancelled";
  }
});

/**
 * ordersListSummary events
 */
Template.ordersListSummary.events({
  /**
  * Submit form
  * @param  {Event} event - Event object
 * @param  {Template} instance - Blaze Template
* @return {void}
*/
  "click button[name=cancel]": function (event, instance) {
    event.stopPropagation();

    const state = instance.state;
    const order = state.get("order");

    const commentText = instance.$(".input-comment");
    const comment = commentText.val().trim();

    const newComment = {
      body: comment,
      userId: Meteor.userId(),
      updatedAt: new Date()
    };

    /* eslint-disable no-undef*/
    Alerts.alert({
      title: "You are about to cancel the order you just placed!",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes"
    }, (confirmed) => {
      if (confirmed) {
        Meteor.call("orders/cancelOrder", order, newComment, (error) => {
          if (error) {
            Logger.warn(error);
          }
        });
      }
    });
  }
});

