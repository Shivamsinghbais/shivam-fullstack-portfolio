import React from "react";
import JobsList from "./features/jobs/JobsList";
import JobForm from "./features/jobs/JobForm";

function App() {
  const [tick, setTick] = React.useState(0); // forces JobsList refresh
  const [selectedJob, setSelectedJob] = React.useState(null); // job being edited

  // called after create/update to refresh list and clear selection
  function handleSuccess() {
    setTick(t => t + 1);
    setSelectedJob(null);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24, padding: 20 }}>
      <div>
        <JobForm job={selectedJob} onSuccess={handleSuccess} onCancel={() => setSelectedJob(null)} />
      </div>

      <div key={tick}>
        <JobsList onEdit={(job) => setSelectedJob(job)} onDelete={() => handleSuccess()} />
      </div>
    </div>
  );
}

export default App;

