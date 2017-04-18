import { GraphQLObjectType, GraphQLString } from "graphql";

const ShippingAddress = new GraphQLObjectType({
  name: "ShippingAddress",
  description: "Lists the Delivery Address",
  fields: () => ({
    fullName: { type: GraphQLString },
    country: { type: GraphQLString },
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    postal: { type: GraphQLString },
    city: { type: GraphQLString },
    region: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});
export default ShippingAddress;
