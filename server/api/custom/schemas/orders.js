import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from "graphql";
import ShippingAddress from "./shipping";

const OrderItems = new GraphQLObjectType({
  name: "OrderItems",
  description: "Lists the Details of Products Ordered",
  fields: () => ({
    title: { type: GraphQLString },
    quantity: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.variants.price;
      }
    }
  })
});

const OrdersType = new GraphQLObjectType({
  name: "Orders",
  description: "Returns A List of Orders",
  fields: () => ({
    sessionId: { type: GraphQLString },
    _id: { type: GraphQLID },
    shopId: { type: GraphQLString },
    workflowStatus: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.workflow.status;
      }
    },
    items: { type: new GraphQLList(OrderItems) },
    shipped: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].shipped;
      }
    },
    tracking: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].tracking;
      }
    },
    email: { type: GraphQLString },
    orderDate: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.createdAt;
      }
    },
    deliveryAddress: {
      type: ShippingAddress,
      resolve: (obj) => {
        return obj.shipping[0].address;
      }
    }
  })
});
export default OrdersType;
