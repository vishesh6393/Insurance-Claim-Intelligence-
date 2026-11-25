import { useState } from "react";
import "./App.css";

const defaultForm = {
  WeekOfMonth: 5,
  WeekOfMonthClaimed: 1,
  Age: 35,
  Deductible: 300,
  DriverRating: 1,
  Month: "Jan",
  DayOfWeek: "Monday",
  Make: "Honda",
  AccidentArea: "Urban",
  DayOfWeekClaimed: "Monday",
  MonthClaimed: "Jan",
  Sex: "Male",
  MaritalStatus: "Single",
  Fault: "Policy Holder",
  PolicyType: "Sedan - Liability",
  VehicleCategory: "Sedan",
  VehiclePrice: "less than 20,000",
  Days_Policy_Accident: "more than 30",
  Days_Policy_Claim: "more than 30",
  PastNumberOfClaims: "none",
  AgeOfVehicle: "3 years",
  AgeOfPolicyHolder: "26 to 30",
  PoliceReportFiled: "No",
  WitnessPresent: "No",
  AgentType: "External",
  NumberOfSuppliments: "none",
  AddressChange_Claim: "no change",
  NumberOfCars: "1 vehicle",
  BasePolicy: "Liability",
};

const sections = [
  {
    title: "Personal Info",
    fields: ["Age", "Sex", "MaritalStatus"],
  },
  {
    title: "Policy Info",
    fields: [
      "WeekOfMonth",
      "Month",
      "DayOfWeek",
      "Deductible",
      "DriverRating",
      "PolicyType",
      "BasePolicy",
      "AgentType",
    ],
  },
  {
    title: "Vehicle Info",
    fields: ["Make", "VehicleCategory", "VehiclePrice", "AgeOfVehicle"],
  },
  {
    title: "Claim Info",
    fields: [
      "WeekOfMonthClaimed",
      "MonthClaimed",
      "DayOfWeekClaimed",
      "AccidentArea",
      "Fault",
      "Days_Policy_Accident",
      "Days_Policy_Claim",
      "PastNumberOfClaims",
      "PoliceReportFiled",
      "WitnessPresent",
      "NumberOfSuppliments",
      "AddressChange_Claim",
      "NumberOfCars",
    ],
  },
  {
    title: "Policy Holder Info",
    fields: ["AgeOfPolicyHolder"],
  },
];

const selectOptions = {
  Month: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  DayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  Make: [
    "Honda",
    "Toyota",
    "Ford",
    "Chevrolet",
    "Dodge",
    "BMW",
    "Mazda",
    "Nisson",
    "Pontiac",
    "Accura",
    "Jaguar",
    "Lexus",
    "Mecedes",
    "Mercury",
    "Saab",
    "Saturn",
    "Porche",
    "Ferrari",
    "VW",
  ],
  AccidentArea: ["Urban", "Rural"],
  DayOfWeekClaimed: [
    "0",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  MonthClaimed: [
    "0",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  Sex: ["Male", "Female"],
  MaritalStatus: ["Single", "Married", "Divorced", "Widow"],
  Fault: ["Policy Holder", "Third Party"],
  PolicyType: [
    "Sedan - Liability",
    "Sedan - Collision",
    "Sedan - All Perils",
    "Sport - Liability",
    "Sport - Collision",
    "Sport - All Perils",
    "Utility - Liability",
    "Utility - Collision",
    "Utility - All Perils",
  ],
  VehicleCategory: ["Sedan", "Sport", "Utility"],
  VehiclePrice: [
    "less than 20,000",
    "20,000 to 29,000",
    "30,000 to 39,000",
    "40,000 to 59,000",
    "60,000 to 69,000",
    "more than 69,000",
  ],
  Days_Policy_Accident: [
    "none",
    "1 to 7",
    "8 to 15",
    "15 to 30",
    "more than 30",
  ],
  Days_Policy_Claim: ["none", "8 to 15", "15 to 30", "more than 30"],
  PastNumberOfClaims: ["none", "1", "2 to 4", "more than 4"],
  AgeOfVehicle: [
    "new",
    "2 years",
    "3 years",
    "4 years",
    "5 years",
    "6 years",
    "7 years",
    "more than 7",
  ],
  AgeOfPolicyHolder: [
    "16 to 17",
    "18 to 20",
    "21 to 25",
    "26 to 30",
    "31 to 35",
    "36 to 40",
    "41 to 50",
    "51 to 65",
    "over 65",
  ],
  PoliceReportFiled: ["No", "Yes"],
  WitnessPresent: ["No", "Yes"],
  AgentType: ["External", "Internal"],
  NumberOfSuppliments: ["none", "1 to 2", "3 to 5", "more than 5"],
  AddressChange_Claim: [
    "no change",
    "under 6 months",
    "1 year",
    "2 to 3 years",
    "4 to 8 years",
  ],
  NumberOfCars: ["1 vehicle", "2 vehicles", "3 to 4", "5 to 8", "more than 8"],
  BasePolicy: ["Liability", "Collision", "All Perils"],
};

function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = Object.keys(defaultForm).filter(
      (k) => typeof defaultForm[k] === "number",
    );
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // const res = await fetch("http://127.0.0.1:8000/predict", {
      const res = await fetch(
        "https://fraud-claim-detection-api-rpq2.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to API. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Insurance Claim Fraud Detector</h1>
      <form onSubmit={handleSubmit}>
        {sections.map((section) => (
          <div key={section.title} className="section">
            <h2>{section.title}</h2>
            <div className="grid">
              {section.fields.map((field) => (
                <div key={field} className="field">
                  <label>{field.replace(/_/g, " ")}</label>
                  {selectOptions[field] ? (
                    <select
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                    >
                      {selectOptions[field].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check for Fraud"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className={`result ${result.fraud ? "fraud" : "no-fraud"}`}>
          <h2>{result.fraud ? "⚠️ Fraud Detected" : "✅ No Fraud Detected"}</h2>
          <p>
            Probability:{" "}
            <strong>{(result.probability * 100).toFixed(1)}%</strong>
          </p>
          <p>
            Threshold:{" "}
            <strong>{(result.threshold_used * 100).toFixed(0)}%</strong>
          </p>
          {result.top_reasons && (
          <div className="reasons">
            <h3>Top Reasons</h3>
            <ul>
              {result.top_reasons.map((r, i) => (
                <li key={i} className={r.impact > 0 ? "up" : "down"}>
                  <span className="reason-feature">{r.feature}</span>
                  <span className="reason-direction">{r.direction}</span>
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
