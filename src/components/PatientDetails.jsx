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
    let isSubscribed = true;

    const fetchPatient = async () => {
      try {
        const data = await getPatientById(registrationId);
        if (isSubscribed) {
          if (Array.isArray(data) && data.length > 0) {
            setPatient(data[0]);
          } else if (data && typeof data === "object" && !Array.isArray(data)) {
            setPatient(data);
          } else {
            setError("Patient details not found.");
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.error(err);
          setError("Failed to fetch patient details.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchPatient();

    return () => {
      isSubscribed = false;
    };
  }, [registrationId]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "60px" }}>
        <h3>Loading patient demographics...</h3>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--danger)" }}>{error || "Patient missing"}</h3>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            ← Back to Patient List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Patient List
      </button>

      <div className="card">
        <div className="header-flex">
          <div>
            <h1 className="title">{patient.Patient_Name}</h1>
            <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              Registration ID: {patient.Registration_ID}
            </p>
          </div>
          <span className="badge">{patient.patient_type || "Standard Patient"}</span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Gender</div>
            <div className="detail-value">{patient.Gender || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Date of Birth</div>
            <div className="detail-value">{patient.Date_Of_Birth || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Phone Number</div>
            <div className="detail-value">{patient.Phone_Number || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Email Address</div>
            <div className="detail-value">{patient.Email_Address || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Region</div>
            <div className="detail-value">{patient.Region || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">District</div>
            <div className="detail-value">{patient.District || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Ward</div>
            <div className="detail-value">{patient.Ward || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Village</div>
            <div className="detail-value">{patient.village || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Country</div>
            <div className="detail-value">{patient.Country || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Occupation</div>
            <div className="detail-value">{patient.Occupation || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Marital Status</div>
            <div className="detail-value">{patient.marital_status || "-"}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Blood Group</div>
            <div className="detail-value">{patient.Blood_Group || "-"}</div>
          </div>

          <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
            <div className="detail-label">Registration Date & Time</div>
            <div className="detail-value">{patient.Registration_Date_And_Time || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;