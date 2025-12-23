import React, { useState,useEffect } from "react";
import "./App.css";

import { data } from "./data";

function Dashboard() {

  const [jdata, setjdata] = useState([]);

   useEffect(() => {
        fetch("http://localhost:3001/jobs/all")
          .then((e) => e.json())
          .then((d) => {
            console.log(d, "d");
            setjdata(d.relt);
          })
          .catch((err) => {
            console.error("Fetch error:", err);
          });
      }, []);

  const total_applications = jdata.length

  const pending = jdata.filter((e)=> e.jstatus === 'pending').length
  const Interviews = jdata.filter((e)=> e.jstatus === "Interview Scheduled").length
  const offered = jdata.filter((e)=> e.jstatus === "Offered").length

  console.log(total_applications, pending, Interviews, offered)

  return (
    <div className="flex justify-between  ">

      <div className="flex justify-between border-2 p-5 m-2 mt-2 rounded-lg">
        <div>
          <p>Total Applications</p>
          <p className="font-bold text-3xl"> {total_applications} </p>
        </div>

        
      </div>


      <div className="flex justify-between border-2 p-5 m-2 mt-2 rounded-lg">
        <div className="w-[100px]">
          <p>Pending</p>
          <p className="font-bold text-3xl"> {pending} </p>
        </div>

        
      </div>


      <div className="flex justify-between border-2 p-5 mt-2 rounded-lg">
        <div className="w-[100px]" >
          <p>Interviews</p>
          <p className="font-bold text-3xl"> {Interviews} </p>
        </div>

        
      </div>


      <div className="flex justify-between border-2 p-5 mt-2 rounded-lg">
        <div className="w-[100px]"> 
          <p>Offers</p>
          <p className="font-bold text-3xl"> {offered} </p>
        </div>

        
      </div>

    </div>

    
  );
}

export default Dashboard;
