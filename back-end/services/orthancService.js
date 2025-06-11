const axios = require("axios");
require("dotenv").config();

// Instance Axios vers Orthanc
const orthancClient = axios.create({
  baseURL: process.env.ORTHANC_URL,
  auth: {
    username: process.env.ORTHANC_USER,
    password: process.env.ORTHANC_PASS,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

// Lister tous les patients
async function listPatients() {
  const res = await orthancClient.get("/patients");
  return res.data; // un tableau d’IDs Orthanc
}

// Lister toutes les études d’un patient
async function listStudies(patientId) {
  const res = await orthancClient.get(`/patients/${patientId}/studies`);
  return res.data; // un tableau d’IDs d’études
}

// Lister toutes les instances d’une étude
async function listInstances(studyId) {
  const res = await orthancClient.get(`/studies/${studyId}/instances`);
  return res.data; // un tableau d’IDs d’instances
}

// Obtenir l’aperçu DICOM JPG d’une instance
async function getPreview(instanceId) {
  const res = await orthancClient.get(`/instances/${instanceId}/preview`, {
    responseType: "arraybuffer",
  });
  const base64 = Buffer.from(res.data, "binary").toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

module.exports = { listPatients, listStudies, listInstances, getPreview };
