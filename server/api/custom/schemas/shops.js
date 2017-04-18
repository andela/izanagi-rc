import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const ShopsType = new GraphQLObjectType({
  name: "Shops",
  description: "Returns Array of Shops",
  fields: () => ({
    name: { type: GraphQLString },
    _id: { type: GraphQLID },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        const email = obj.emails[0].address;
        return email;
      }
    },
    lastUpdated: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.updatedAt;
      }
    }
  })
});

export default ShopsType;
