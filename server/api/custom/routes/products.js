const productRoutes = (router, handler) => {
  router.get("/api/products/all", (req, res) => {
    handler.post(`http://${req.headers.host}/graphql`,
        { query: "{products {title _id vendor price inventoryQuantity }} " },
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
export default productRoutes;
