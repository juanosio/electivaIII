const { Router } = require("express");
const routes = Router();

routes.use(require("./loginRoutes.js"));
routes.use(require("./categoryRoutes.js"));
routes.use(require("./supplierRoutes.js"));
routes.use(require("./articleRoutes.js"));
routes.use(require("./revenueRoutes.js"));

routes.get('/', function (_, res) {
    res.render('./login/index');
})

module.exports = routes