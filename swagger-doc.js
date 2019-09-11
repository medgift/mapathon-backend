const swaggerUi = require("swagger-ui-express");
const swaggeJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Mapathon API",
      version: "1.0.0",
      description: "REST API for the Mapathon project (645-1)"
    },
    basePath: "/"
  },
  apis: ["routes/*.js"]
};

const specs = swaggeJsdoc(options);

module.exports = app => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
};
