import React from "react";
import JobsList from "./features/jobs/JobsList";
import JobForm from "./features/jobs/JobForm";

function App() {
  // simple local state to force refresh: we will re-render JobsList by key change
  const [tick, setTick] = React.useState(0);
  return (
    <div>
      <JobForm onSuccess={() => setTick((t) => t + 1)} />
      <div key={tick}><JobsList /></div>
    </div>
  );
}

export default App;

