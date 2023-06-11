import cors from "cors";
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";

import { DB, PORT } from "./Config";
import { errorHandler } from "./Middleware/errorHandler";
import Routes from "./Routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(errorHandler);
app.use(morgan("tiny"));
app.use("/v1", Routes);

app.get("/", (req, res) => {
  res.send("Welcome to BZB API");
});

mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Database Connection Successful on ${PORT}`);
    })
  )
  .catch(() => console.log("Database Connection Failed"));
