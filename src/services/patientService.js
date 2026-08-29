import axios from "axios";

const API_URL = "http://41.188.172.204:3033/test/patient-registration";

export const getPatients = async (registrationId) => {
  const response = await axios.get(API_URL, {
    params: registrationId ? { Registration_ID: registrationId } : {},
  });

  const result = response?.data?.data?.data;
  return Array.isArray(result) ? result : result ? [result] : [];
};

export const getPatientById = async (registrationId) => {
  const response = await axios.get(API_URL, {
    params: { Registration_ID: registrationId },
  });

  const result = response?.data?.data?.data;
  return Array.isArray(result) ? result : result ? [result] : [];
};

export const updatePatient = async (registrationId, patientData) => {
  // Use URLSearchParams to avoid CORS preflight blocking
  const params = new URLSearchParams();
  if (patientData.Patient_Name) params.append("Patient_Name", patientData.Patient_Name);
  if (patientData.Gender) params.append("Gender", patientData.Gender);

  const response = await axios.put(
    `${API_URL}/${registrationId}?${params.toString()}`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};