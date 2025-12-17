import db from "../routes/db.js";

import mysql2 from "mysql2";

import express, { application } from "express";
import cors from "cors";
const router = express.Router();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

router.get("/all", (req, res) => {
  db.query("select * from jobtrack", (err, relt) => {
    res.json({ relt });
  });
});

router.get("/job/:id", (req, res) => {
  const id = req.params.id;
  db.query("select * from jobtrack where id = ? ", [id], (err, rlts) => {
    if (err) {
      res.json({ err: err });
    } else {
      res.json({ res: rlts });
    }
  });
});

router.delete("/job/:id", (req, res) => {
  const id = req.params.id;

  console.log(id)

  db.query("delete from jobtrack where id = ? ", [id], (err, reslt) => {
    if (err) {
      res.json({ msg: err });
    } else {
      res.json({ msg: "application has been deleted" });
    }
  });
});

router.post("/jb", (req, res) => {
  const {
    companyName,
    jobTitle,
    location,
    salaryRange,
    applicationDate,
    status,
    applicationMethod,
    jobLink,
    notes,
    interviewDate,
  } = req.body;

  db.query(
    "insert into jobtrack(companyName,jobtitile,location,salaryRange,applicationDate,jstatus,applicationMethod,jobLink,notes,interviewDate) values (?,?,?,?,?,?,?,?,?,?)",
    [
      companyName,
      jobTitle,
      location,
      salaryRange,
      applicationDate,
      status,
      applicationMethod,
      jobLink,
      notes,
      interviewDate === "" ? null : interviewDate,
      ,
    ],
    (err, rls) => {
      if (err) {
        res.json({ msg: err });
      } else {
        res.json({ data: rls, msg: "posted" });
      }
    }
  );

  console.log(
    companyName,
    jobLink,
    jobTitle,
    location,
    salaryRange,
    applicationDate,
    status,
    applicationMethod,
    interviewDate
  );
});

export default router;
