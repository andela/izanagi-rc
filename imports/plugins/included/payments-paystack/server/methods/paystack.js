/* eslint camelcase: 0 */
// meteor modules
import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({
  /**
   * wallet/fundAccount
   * @description gets paystack api keys
   * @return {Object} returns the paystack keys
   */
  "paystack/getKeys": function () {
    const paystack = Collections.Packages.findOne({
      name: "paystack",
      shopId: Reaction.getShopId()
    });
    return {
      public: paystack.settings.publicKey,
      secret: paystack.settings.secretKey
    };
  }
});
