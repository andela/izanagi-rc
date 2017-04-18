import productsRoutes from "./products";
import usersRoutes from "./accounts";
import shopsRoutes from "./shops";
import orderRoutes from "./orders";

const Routes = (router, handler) => {
  productsRoutes(router, handler);
  usersRoutes(router, handler);
  shopsRoutes(router, handler);
  orderRoutes(router, handler);
};
export default Routes;
