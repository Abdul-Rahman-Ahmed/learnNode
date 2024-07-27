require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use("/uploads", express.static("uploads"));
const RequestStatus = require("./utils/httpRequestStatus");
app.use(express.json());
app.use(cors());
const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("connect database is successful");
}

main().catch((err) => console.log(err));

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res) => {
  return res.status(400).json({
    status: RequestStatus.ERROR,
    message: "Wrong request",
  });
});
app.use((err, req, res, next) => {
  return res.status(err.code || 400).json({
    status: err.statusText || RequestStatus.ERROR,
    data: null,
    message: err.message,
    code: err.code || 400,
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on 5000");
});
