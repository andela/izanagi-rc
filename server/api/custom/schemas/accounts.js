import { GraphQLObjectType,
         GraphQLString } from "graphql";

const UsersType = new GraphQLObjectType({
  name: "Users",
  description: "Returns select fields for all Users",
  fields: () => ({
    id: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        if (!obj.emails.length) {
          return "No Email Specified";
        }
        return obj.emails[0].address;
      }
    },
    verified: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.emails.length) {
          return obj.emails[0].verified;
        }
        return null;
      }
    },
    fullName: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.profile.addressBook) {
          return obj.profile.addressBook[0].fullName;
        }
        return "No Name Supplied";
      }
    },
    userId: { type: GraphQLString },
    shopId: { type: GraphQLString }
  })
});
export default UsersType;
