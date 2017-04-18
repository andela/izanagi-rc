const orderRoutes = (router, handler) => {
  router.get("/api/orders/all/:emailID", (request, response) => {
    const emailID = request.params.emailID.replace(/"/g, "");
    handler.post(`http://${request.headers.host}/graphql`,
      { query: `
       {
        orders (emailID: "${emailID}") {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
        }
      }`
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
  });

  router.get("/api/orders/processed_orders/:emailID", (request, response) => {
    const emailID = request.params.emailID.replace(/"/g, "");
    handler.post(`http://${request.headers.host}/graphql`,
      { query: `
       {
        orders (
          emailID: "${emailID}",
          orderStatus: "coreOrderWorkflow/completed"
        )
        {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
        }
      }`
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
  });

  router.get("/api/orders/cancelled_orders/:emailID", (request, response) => {
    const emailID = request.params.emailID.replace(/"/g, "");
    handler.post(`http://${request.headers.host}/graphql`,
      { query: `
      {
        orders (emailID: "${emailID}",
        orderStatus: "coreOrderWorkflow/canceled"
        )
        {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
        }
      }`
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
  });
};
export default orderRoutes;
