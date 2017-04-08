import { Shops } from "/lib/collections";
import { Counts } from "meteor/tmeasday:publish-counts";

const shopsRoutes = (router, handler) => {
  router.get("/api/shops/all", (req, res) => {
    handler.post(`http://${req.headers.host}/graphql`,
      { query: `
          {
              shops {
                  _id
                  name
                  emails
                  lastUpdated
              }
          }`
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((result) => {
          res.status(200).json(result.data);
        })
        .catch((error) => {
          res.status(409).send(error);
        });
  });
};
export default shopsRoutes;

Meteor.publish("shops-count", function () {
  Counts.publish(this, "shops-count", Shops.find());
}, {
  url: "/api/shops/count"
});
JsonRoutes.setResponseHeaders({
  "Cache-Control": "no-store",
  "Pragma": "no-cache",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
});

