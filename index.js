const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const cpuRouter = require("./routers/cpuRouter");
const gpuRouter = require("./routers/gpuRouter");
const programRouter = require("./routers/programRouter");
const laptopRouter = require("./routers/laptopRouter");
const userRouter = require("./routers/userRouter");

const globalErrorHandler = require("./middlewares/globalErrorhandler");
const ApiError = require("./Utils/apiError");

dotenv.config({ path: "./config.env" });
connectToDatabase();
const app = express();
const server = Listen();
middlewareParsing();

// //using routes
app.use("/api/gpus/", gpuRouter);
app.use("/api/cpus/", cpuRouter);
app.use("/api/programs/", programRouter);
app.use("/api/laptops/", laptopRouter);
app.use("/auth", userRouter);

app.all("*", (req, res, next) => {
  return next(new ApiError(`can't find ${req.url}`, 404));
});

app.use(globalErrorHandler);
function middlewareParsing() {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
function Listen() {
  var port = process.env.port || 8000;

  return app.listen(port, () => {
    console.log(`listening at ${port}`);
  });
}
function connectToDatabase() {
  mongoose
    .connect(process.env.connect_url)
    .then(console.log("connected to Database"))
    .catch((error) => {
      console.log("error has been occurred");
    });
}

process.on("unhandledRejection", (error) => {
  console.log(error.name);
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (error) => {
  console.log(error);
  server.close(() => {
    process.exit(1);
  });
});
