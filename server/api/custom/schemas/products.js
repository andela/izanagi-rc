import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const ProductsType = new GraphQLObjectType({
  name: "Products",
  description: "Returns Product details",
  fields: () => ({
    title: { type: GraphQLString },
    _id: { type: GraphQLString },
    vendor: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.price.range) {
          return obj.price.range;
        }
        return obj.price;
      }
    },
    inventoryQuantity: { type: GraphQLInt }
  })
});
export default ProductsType;
