const swaggerUi = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");

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
  servers: {
    url: "http://localhost:4000"
  },
  apis: ["routes/*.js"]
};

const specs = swaggerJSdoc(options);

let uiOptions = {
  swaggerOptions: {
    supportedSubmitMethods: []
  }
};

module.exports = app => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(specs, uiOptions));
};
