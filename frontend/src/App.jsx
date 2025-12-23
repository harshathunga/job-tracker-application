import { useState,useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Application from "./Application";
import Dashboard from "./Dashboard";
import { data } from "./data";
import Login from "./Login";



function App() {
  // const [count, setCount] = useState(0)
  const [jdata, setjdata] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [form_toggle, setform_toggle] = useState(false);
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


  const handlefetch = () =>{
    fetch("http://localhost:3001/jobs/all")
        .then((e) => e.json())
        .then((d) => {
          console.log(d, "d");
          setjdata(d.relt);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
  }
    useEffect(() => {
      handlefetch()
    }, []);

 const handleform = async () => {
  console.log(formData);

  try {
    const res = await fetch("http://localhost:3001/jobs/jb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Server Response:", data);

    if (data.msg === "posted") {
      alert("Data posted successfully!");
    } else {
      alert("Error: " + JSON.stringify(data));
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Something went wrong!");
  }
  handlefetch()
};

  const total_applications = jdata.length;
  return (
    <div>

      {/* <Login></Login> */}
      <nav className=" flex justify-between m-10 text-blue-600 ">
        <h1 className="font-bold text-lg">job track</h1>
        <button onClick={() => setform_toggle(true)}> add application</button>
      </nav>
      {form_toggle ? (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 snap-y">
          <div>
            <div className=" max-h-[80vh] overflow-y-auto p-4 bg-white shadow rounded snap-y">
              <button
                className="border hover:bg-red-200 px-6 py-3 rounded-md bg-red-600"
                onClick={() => setform_toggle(false)}
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
                  setFormData({ ...formData, companyName: e.target.value })
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
                  setFormData({ ...formData, jobTitle: e.target.value })
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
                  setFormData({ ...formData, location: e.target.value })
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
                  setFormData({ ...formData, salaryRange: e.target.value })
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
                  setFormData({ ...formData, applicationDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
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
                  setFormData({ ...formData, interviewDate: e.target.value })
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
                  setFormData({ ...formData, jobLink: e.target.value })
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
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes..."
              ></textarea>

              <button
                onClick={()=> handleform()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {" "}
                submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        " "
      )}
      <div className="flex">
        <div className="p-2">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === "dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveView("dashboard")}
          >
            dashboard
          </button>
        </div>

        <div className="p-2">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === "application"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveView("application")}
          >
            application({total_applications})
          </button>
        </div>
      </div>
      this is the activeView {activeView}
      <main className="m-6 ">
        {activeView === "dashboard" ? <Dashboard /> : <Application />}
      </main>


      
    </div>
  );
}

export default App;
