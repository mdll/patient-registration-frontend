import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatientById } from "../services/patientService";

function PatientDetails() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPatientById(registrationId);

        if (Array.isArray(data) && data.length > 0) {
          setPatient(data[0]);
        } else {
          setError("Patient not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [registrationId]);

  if (loading) {
    return <h3>Loading patient details...</h3>;
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h3>{error}</h3>

        <button onClick={() => navigate("/")}>Back to Patients</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={() => navigate("/")}>← Back to Patients</button>

      <h1>Patient Demographics</h1>

      <table border="1" cellPadding="10" cellSpacing="0">
        <tbody>
          <tr>
            <th>Registration ID</th>
            <td>{patient.Registration_ID}</td>
          </tr>

          <tr>
            <th>Patient Name</th>
            <td>{patient.Patient_Name}</td>
          </tr>

          <tr>
            <th>Gender</th>
            <td>{patient.Gender}</td>
          </tr>

          <tr>
            <th>Date of Birth</th>
            <td>{patient.Date_Of_Birth}</td>
          </tr>

          <tr>
            <th>Region</th>
            <td>{patient.Region}</td>
          </tr>

          <tr>
            <th>District</th>
            <td>{patient.District}</td>
          </tr>

          <tr>
            <th>Ward</th>
            <td>{patient.Ward}</td>
          </tr>

          <tr>
            <th>Village</th>
            <td>{patient.village}</td>
          </tr>

          <tr>
            <th>Phone Number</th>
            <td>{patient.Phone_Number}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>{patient.Email_Address || "-"}</td>
          </tr>

          <tr>
            <th>Country</th>
            <td>{patient.Country}</td>
          </tr>

          <tr>
            <th>Occupation</th>
            <td>{patient.Occupation || "-"}</td>
          </tr>

          <tr>
            <th>Marital Status</th>
            <td>{patient.marital_status}</td>
          </tr>

          <tr>
            <th>Blood Group</th>
            <td>{patient.Blood_Group || "-"}</td>
          </tr>

          <tr>
            <th>Patient Type</th>
            <td>{patient.patient_type}</td>
          </tr>

          <tr>
            <th>Registration Date</th>
            <td>{patient.Registration_Date_And_Time}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PatientDetails;
