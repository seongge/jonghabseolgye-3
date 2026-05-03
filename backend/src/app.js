const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

// Swagger 문서
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

module.exports = app;