const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "서버가 정상적으로 실행 중입니다."
  });
});

app.use("/api", routes);

module.exports = app;