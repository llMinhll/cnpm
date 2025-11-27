const express = require("express");
const Route = require("../models/Route");
const Stop = require("../models/Stop");

const router = express.Router();

// GET /api/routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find().sort({ code: 1 });
    res.json(routes);
  } catch (err) {
    console.error("GET /routes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// (tuỳ chọn) tạo tuyến mới
router.post("/", async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    console.error("POST /routes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/routes/:id/stops
router.get("/:id/stops", async (req, res) => {
  try {
    const stops = await Stop.find({ route: req.params.id }).sort("stop_order");
    res.json(stops);
  } catch (err) {
    console.error("GET /routes/:id/stops error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
