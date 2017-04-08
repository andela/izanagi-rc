import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./schemas";
import axios from "axios";
import routes from "./routes/index";

const app = express();
const router = express.Router();

app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

routes(router, axios);

app.use(router);
WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
