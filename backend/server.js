import express from "express";
import jobdata from "./routes/jobdata.js";
import cors from "cors";
const app = express();
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "DELETE", 'PUT'],

    credentials: true,
  })
);

app.use("/jobs", jobdata);

app.listen(3001, () => {
  console.log("server is running in 3001");
});


