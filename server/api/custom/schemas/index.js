import { GraphQLObjectType,
         GraphQLString,
         GraphQLList,
         GraphQLSchema } from "graphql";

import ProductsType from "./products";
import UsersType from "./accounts";
import ShopsType from "./shops";
import OrdersType from "./orders";
import { Products, Accounts, Shops, Orders } from "/lib/collections";

const query = new GraphQLObjectType({
  name: "Query",
  description: "GraphQL configurations",
  fields: () => ({
    products: {
      type: new GraphQLList(ProductsType),
      description: "Display Products",
      resolve: () => {
        return Products.find().fetch();
      }
    },
    users: {
      type: new GraphQLList(UsersType),
      description: "Display Users",
      resolve: () => {
        return Accounts.find().fetch();
      }
    },
    shops: {
      type: new GraphQLList(ShopsType),
      description: "Display Shops",
      resolve: () => {
        return Shops.find().fetch();
      }
    },
    orders: {
      type: new GraphQLList(OrdersType),
      description: "Display Orders",
      args: {
        emailID: { type: GraphQLString },
        orderStatus: { type: GraphQLString }
      },
      resolve: (root, args) => {
        if (!args.emailID) {
          return "Email Required!";
        } else if (args.emailID === "admin" && args.orderStatus) {
          return Orders.find({ "workflow.status": args.orderStatus }).fetch();
        } else if (args.emailID === "admin") {
          return Orders.find().fetch();
        } else if (args.orderStatus) {
          return Orders.find(
            { "email": args.emailID, "workflow.status": args.orderStatus })
            .fetch();
        }
        return Orders.find({ email: args.emailID }).fetch();
      }
    }
  })
});

const schema = new GraphQLSchema({
  query
});

export default schema;
