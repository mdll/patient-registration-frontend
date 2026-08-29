import { BrowserRouter, Routes, Route } from "react-router-dom";

import Patients from "./components/Patients";
import PatientDetails from "./pages/PatientDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Patients registrationId="" />} />

        <Route path="/patients/:registrationId" element={<PatientDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
