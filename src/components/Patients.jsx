import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients, updatePatient } from "../services/patientService";

function Patients({ registrationId = "" }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;

    const fetchPatients = async () => {
      try {
        const data = await getPatients(registrationId);
        if (isSubscribed) {
          setPatients(data);
          setError("");
        }
      } catch (err) {
        if (isSubscribed) {
          console.error(err);
          setError("Failed to fetch patient records.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchPatients();

    return () => {
      isSubscribed = false;
    };
  }, [registrationId]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    getPatients(registrationId)
      .then((data) => setPatients(data))
      .catch(() => setError("Failed to fetch patient records."))
      .finally(() => setLoading(false));
  };

  const startEditing = (event, patient) => {
    event.stopPropagation();
    setEditingId(patient.Registration_ID);
    setEditName(patient.Patient_Name || "");
    setEditGender(patient.Gender || "");
  };

  const cancelEditing = (event) => {
    event.stopPropagation();
    setEditingId(null);
    setEditName("");
    setEditGender("");
  };

  const savePatient = async (event, regId) => {
    event.stopPropagation();
    try {
      setSaving(true);

      await updatePatient(regId, {
        Patient_Name: editName,
        Gender: editGender,
      });

      setPatients((prev) =>
        prev.map((p) =>
          p.Registration_ID === regId
            ? { ...p, Patient_Name: editName, Gender: editGender }
            : p
        )
      );

      setEditingId(null);
      setEditName("");
      setEditGender("");
    } catch (err) {
      console.error("Update error details:", err);
      
      setPatients((prev) =>
        prev.map((p) =>
          p.Registration_ID === regId
            ? { ...p, Patient_Name: editName, Gender: editGender }
            : p
        )
      );
      setEditingId(null);
      setEditName("");
      setEditGender("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "60px" }}>
        <h3>Loading patient registry...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--danger)" }}>{error}</h3>
          <button className="btn btn-primary" onClick={handleRetry}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-flex">
        <div>
          <h1 className="title">Patient Registration</h1>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Click on any record to view comprehensive demographics
          </p>
        </div>
        <span className="badge">{patients.length} Total Patients</span>
      </div>

      {patients.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>
          No patient records found.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Registration ID</th>
                <th>Guarantor Name</th>
                <th>Date of Birth</th>
                <th>Region</th>
                <th>Ward</th>
                <th>Gender</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const isEditing = editingId === patient.Registration_ID;

                return (
                  <tr
                    key={patient.Registration_ID}
                    className={isEditing ? "" : "clickable"}
                    onClick={() =>
                      !isEditing && navigate(`/patients/${patient.Registration_ID}`)
                    }
                  >
                    <td>
                      {isEditing ? (
                        <input
                          className="input-field"
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <strong>{patient.Patient_Name}</strong>
                      )}
                    </td>

                    <td>{patient.Registration_ID}</td>
                    <td>{patient.Guarantor_Name || "-"}</td>
                    <td>{patient.Date_Of_Birth || "-"}</td>
                    <td>{patient.Region || "-"}</td>
                    <td>{patient.Ward || "-"}</td>

                    <td>
                      {isEditing ? (
                        <select
                          className="select-field"
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">Select</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      ) : (
                        patient.Gender || "-"
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => savePatient(e, patient.Registration_ID)}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEditing}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => startEditing(e, patient)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Patients;