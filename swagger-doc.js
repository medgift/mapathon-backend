const swaggerUi = require("swagger-ui-express");
const swaggeJSdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mapathon API",
      version: "1.0.0",
      description: "REST API for the Mapathon project (645-1)"
    },
    basePath: "/"
  },
  apis: ["routes/*.js"]
};

const specs = swaggeJSdoc(options);

module.exports = app => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
};
