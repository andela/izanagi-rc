const usersRoutes = (router, handler) => {
  router.get("/api/accounts/all", (req, res) => {
    handler.post(`http://${req.headers.host}/graphql`,
      { query:
        `{
            users {
                userId
                shopId
                fullName
                emails
                verified
                createdAt
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
export default usersRoutes;
