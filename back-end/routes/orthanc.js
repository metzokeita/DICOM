const express = require("express");
const router = express.Router();
const orthanc = require("../services/orthancService");

// GET /api/orthanc/patients
router.get("/patients", async (_, res) => {
  try {
    const patients = await orthanc.listPatients();
    res.json(patients);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orthanc/patients/:id/studies
router.get("/patients/:id/studies", async (req, res) => {
  try {
    const studies = await orthanc.listStudies(req.params.id);
    res.json(studies);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orthanc/studies/:id/instances
router.get("/studies/:id/instances", async (req, res) => {
  try {
    const instances = await orthanc.listInstances(req.params.id);
    res.json(instances);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orthanc/instances/:id/preview
router.get("/instances/:id/preview", async (req, res) => {
  try {
    const imageDataUrl = await orthanc.getPreview(req.params.id);
    res.json({ image: imageDataUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
