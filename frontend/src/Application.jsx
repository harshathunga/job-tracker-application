import React from "react";
import "./App.css";

// import { data } from "./data";
import { useState } from "react";
import { useEffect } from "react";

function Application() {
  const [search, setsearch] = useState("");
  const [selected, setselected] = useState("all");
  const [jdata, setjdata] = useState([]);
  const [optfilter, setoptfilter] = useState([]);
  const [editdata, seteditdata] = useState(false);
  const [eid, seteid] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "Remote",
    salaryRange: "",
    applicationDate: new Date().toISOString().split("T")[0],
    status: "Applied",
    applicationMethod: "LinkedIn",
    jobLink: "",
    notes: "",
    interviewDate: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/jobs/all")
      .then((e) => e.json())
      .then((d) => {
        // console.log(d);
        setjdata(d);
        setoptfilter(d.relt);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  console.log("this is optfiller", optfilter);
  // console.log("this is jdata", jdata);

  const searchdata =
    jdata.relt?.filter(
      (e) =>
        (e.companyName &&
          e.companyName.toLowerCase().includes(search.toLowerCase())) ||
        (e.jobTitile &&
          e.jobTitile.toLowerCase().includes(search.toLowerCase()))
    ) || [];
  console.log("this is searchdata", searchdata);

  const handledelete = (id) => {
    console.log(id);

    fetch(`http://localhost:3001/jobs/job/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error(err));

    fetch("http://localhost:3001/jobs/all")
      .then((e) => e.json())
      .then((d) => {
        // console.log(d);
        setjdata(d);
        setoptfilter(d.relt);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const handlefilter = (e) => {
    const val = e.target.value;
    setselected(val);
    console.log("this is the val:---", selected, val);

    const filldata =
      val === "all" ? jdata.relt : jdata.relt?.filter((i) => i.jstatus === val);

    setoptfilter(filldata);

    console.log(val, optfilter, "this is opt filrter");
  };

  const setedit = async (id) => {
    console.log(id);

    seteid(id);
    const res = await fetch(`http://localhost:3001/jobs/job/${id}`);

    const data = await res.json();
    const job = data.res[0];

    console.log(job.jstatus);

    setFormData({
      companyName: job.companyName || "",
      jobTitle: job.jobtitile || "",
      location: job.location || "Remote",
      salaryRange: job.salaryRange || "",
      applicationDate: job.applicationDate
        ? job.applicationDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      status: job.jstatus || "Applied",
      applicationMethod: job.applicationMethod || "LinkedIn",
      jobLink: job.jobLink || "",
      notes: job.notes || "",
      interviewDate: job.interviewDate ? job.interviewDate.split("T")[0] : "",
    });
  };

  console.log(formData);

  const postedit = async () => {
    console.log(eid);
    // alert("this is editid", eid);

    try {
      const res = await fetch(`http://localhost:3001/jobs/job/${eid}`, {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      console.log("Server Response:", data);

      if (data.msg === "posted") {
        alert("Data posted successfully!");
      } else {
        alert("Error: " + JSON.stringify(data));
      }

      fetch("http://localhost:3001/jobs/all")
        .then((e) => e.json())
        .then((d) => {
          // console.log(d);
          setjdata(d);
          setoptfilter(d.relt);
        });
    } catch (error) {
      console.error("Fetch error:", error);
      // alert("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="">
        <input
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          className="border border-black w-full p-2 bg-pink-1000"
          placeholder="Search By Company name"
          type="text"
        />
      </div>

      <div>
        <select value={selected} onChange={handlefilter}>
          <option value="all">all</option>

          {/* {jdata.relt?.map((e,id) => (
            <option value={e.jstatus}>{e.jstatus}</option>
          ))} */}

          <option value="Offered">Offered</option>
          <option value="rejected">rejected</option>
          <option value="Applied">Applied</option>
        </select>
      </div>

      {/* {jdata.relt?.map((e, id) => (
        <div key={e.id}>
          <h1>{e.companyName}</h1>
          
        </div>
      ))} */}

      <div>
        {search === "" ? (
          <div>
            {optfilter?.map((e, id) => (
              <div key={e.id}>
                <div className="flex justify-between mt-6">
                  <div className=" flex justify-between border border-black w-full">
                    <div>
                      <h2 className="p-2">{e.jobtitile}</h2>
                      <h2 className="p-2">{e.companyName}</h2>
                      <p>
                        {e.applicationMethod}, {e.applicationDate}
                      </p>

                      <div className="flex">
                        <button
                          onClick={() => {
                            setedit(e.id), seteditdata(!editdata);
                          }}
                          className="p-3 m-2 bg-blue-400 rounded-md"
                        >
                          edit
                        </button>

                        {/* {{}}  This is the pop up function of the editmode */}

                        <div>
                          {editdata ? (
                            <div>
                              <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 snap-y">
                                <div>
                                  <div className=" max-h-[80vh] overflow-y-auto p-4 bg-white shadow rounded snap-y">
                                    <button
                                      className="border hover:bg-red-200 px-6 py-3 rounded-md bg-red-600"
                                      onClick={() => seteditdata(!editdata)}
                                    >
                                      back
                                    </button>

                                    <label className="block text-sm font-medium text-gray-700 m-2">
                                      Company Name *
                                    </label>

                                    <input
                                      className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      value={formData.companyName}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          companyName: e.target.value,
                                        })
                                      }
                                      type="text"
                                      placeholder="Company name"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 p-2">
                                      Job Title *
                                    </label>
                                    <input
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      value={formData.jobTitle}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          jobTitle: e.target.value,
                                        })
                                      }
                                      type="text"
                                      placeholder="jobttitle"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 p-1">
                                      location *
                                    </label>
                                    <select
                                      value={formData.location}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          location: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>Remote</option>
                                      <option>Onsite</option>
                                      <option>Hybrid</option>
                                    </select>

                                    <label className="block text-sm font-medium text-white-500 mb-1">
                                      Salary Range
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.salaryRange}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          salaryRange: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="e.g., $80k-$100k"
                                    />

                                    <label className="block text-sm font-medium text-white-600 mb-1">
                                      Application Date *
                                    </label>
                                    <input
                                      type="date"
                                      required
                                      value={formData.applicationDate}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          applicationDate: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Status *
                                    </label>
                                    <select
                                      value={formData.status}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          status: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>Applied</option>
                                      <option>Interview Scheduled</option>
                                      <option>Interviewed</option>
                                      <option>Offered</option>
                                      <option>Rejected</option>
                                      <option>Withdrawn</option>
                                    </select>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Application Method
                                    </label>
                                    <select
                                      value={formData.applicationMethod}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          applicationMethod: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>LinkedIn</option>
                                      <option>Company Website</option>
                                      <option>Referral</option>
                                      <option>Job Board</option>
                                      <option>Recruiter</option>
                                      <option>Other</option>
                                    </select>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Interview Date
                                    </label>
                                    <input
                                      type="date"
                                      value={formData.interviewDate}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          interviewDate: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Job Link
                                    </label>
                                    <input
                                      type="url"
                                      value={formData.jobLink}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          jobLink: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="https://..."
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Notes
                                    </label>
                                    <textarea
                                      value={formData.notes}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          notes: e.target.value,
                                        })
                                      }
                                      rows="3"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Add any additional notes..."
                                    ></textarea>

                                    <button
                                      onClick={() => postedit()}
                                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                      {" "}
                                      submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            " "
                          )}
                        </div>

                        <button
                          onClick={() => handledelete(e.id)}
                          className="p-3 m-2 rounded-md bg-red-500"
                        >
                          delete
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="p-2 flex">
                        {e.jstatus === "Offered"
                          ? e.interviewDate && (
                              <p>
                                {" "}
                                {e.jstatus} on {formatDate(e.interviewDate)}
                              </p>
                            )
                          : e.jstatus === "Applied"
                          ? e.applicationDate && (
                              <p>
                                {e.jstatus} on {formatDate(e.applicationDate)}
                              </p>
                            )
                          : null}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchdata.length === 0 ? (
          <p className="text-gray-500 text-lg">No applications found</p>
        ) : (
          <div>
            {searchdata.map((e, id) => (
              <div key={e.id}>
                <div className="flex justify-between mt-6">
                  <div className=" flex justify-between border border-black w-full">
                    <div>
                      <h2 className="p-2">{e.jobtitile}</h2>
                      <h2 className="p-2">{e.companyName}</h2>
                      <p>
                        {e.applicationMethod}, {e.applicationDate}
                      </p>

                      <div className="flex">
                        <button
                          onClick={() => {
                            setedit(e.id), seteditdata(!editdata);
                          }}
                          className="p-3 m-2 bg-blue-400 rounded-md"
                        >
                          edit
                        </button>

                        {/* {{}}  This is the pop up function of the editmode */}

                        <div>
                          {editdata ? (
                            <div>
                              <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 snap-y">
                                <div>
                                  <div className=" max-h-[80vh] overflow-y-auto p-4 bg-white shadow rounded snap-y">
                                    <button
                                      className="border hover:bg-red-200 px-6 py-3 rounded-md bg-red-600"
                                      onClick={() => seteditdata(!editdata)}
                                    >
                                      back
                                    </button>

                                    <label className="block text-sm font-medium text-gray-700 m-2">
                                      Company Name *
                                    </label>

                                    <input
                                      className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      value={formData.companyName}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          companyName: e.target.value,
                                        })
                                      }
                                      type="text"
                                      placeholder="Company name"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 p-2">
                                      Job Title *
                                    </label>
                                    <input
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      value={formData.jobTitle}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          jobTitle: e.target.value,
                                        })
                                      }
                                      type="text"
                                      placeholder="jobttitle"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 p-1">
                                      location *
                                    </label>
                                    <select
                                      value={formData.location}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          location: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>Remote</option>
                                      <option>Onsite</option>
                                      <option>Hybrid</option>
                                    </select>

                                    <label className="block text-sm font-medium text-white-500 mb-1">
                                      Salary Range
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.salaryRange}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          salaryRange: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="e.g., $80k-$100k"
                                    />

                                    <label className="block text-sm font-medium text-white-600 mb-1">
                                      Application Date *
                                    </label>
                                    <input
                                      type="date"
                                      required
                                      value={formData.applicationDate}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          applicationDate: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Status *
                                    </label>
                                    <select
                                      value={formData.status}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          status: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>Applied</option>
                                      <option>Interview Scheduled</option>
                                      <option>Interviewed</option>
                                      <option>Offered</option>
                                      <option>Rejected</option>
                                      <option>Withdrawn</option>
                                    </select>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Application Method
                                    </label>
                                    <select
                                      value={formData.applicationMethod}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          applicationMethod: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option>LinkedIn</option>
                                      <option>Company Website</option>
                                      <option>Referral</option>
                                      <option>Job Board</option>
                                      <option>Recruiter</option>
                                      <option>Other</option>
                                    </select>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Interview Date
                                    </label>
                                    <input
                                      type="date"
                                      value={formData.interviewDate}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          interviewDate: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Job Link
                                    </label>
                                    <input
                                      type="url"
                                      value={formData.jobLink}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          jobLink: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="https://..."
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Notes
                                    </label>
                                    <textarea
                                      value={formData.notes}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          notes: e.target.value,
                                        })
                                      }
                                      rows="3"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Add any additional notes..."
                                    ></textarea>

                                    <button
                                      onClick={() => postedit()}
                                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                      {" "}
                                      submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            " "
                          )}
                        </div>

                        <button
                          onClick={() => handledelete(e.id)}
                          className="p-3 m-2 rounded-md bg-red-500"
                        >
                          delete
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="p-2 flex">
                        {e.jstatus === "Offered"
                          ? e.interviewDate && (
                              <p>
                                {" "}
                                {e.jstatus} on {formatDate(e.interviewDate)}
                              </p>
                            )
                          : e.jstatus === "Applied"
                          ? e.applicationDate && (
                              <p>
                                {e.jstatus} on {formatDate(e.applicationDate)}
                              </p>
                            )
                          : null}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================ */}

      {/* <div>
        {
         optfilter?.map((e,id)=> (
                        <div key={e.id}>
                <div className="flex justify-between mt-6">
                  <div className=" flex justify-between border border-black w-full">
                    <div>
                      <h2 className="p-2">{e.jobTitle}</h2>
                      <h2 className="p-2">{e.companyName}</h2>
                      <p>
                        {e.applicationMethod}, {e.applicationDate}
                      </p>
                    </div>

                    <div>
                      <p className="p-2 flex">
                        {e.jstatus},{" "}
                        {e.interviewDate === "" ? (
                          ""
                        ) : (
                          <p> on {e.interviewDate} </p>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
         ))
        }
      </div> */}
    </div>
  );
}

export default Application;
