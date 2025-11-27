// routes/bus.routes.js
const express = require("express");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

const router = express.Router();

/**
 * GET /api/buses
 * Lấy tất cả xe hoặc theo route_id
 * VD: /api/buses?route_id=xxxxx
 */
router.get("/", async (req, res) => {
  try {
    const { route_id } = req.query;

    const filter = route_id ? { route: route_id } : {};

    const buses = await Bus.find(filter).populate("route");

    res.json(buses);
  } catch (err) {
    console.error("GET /buses error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/buses
 * Body cho phép:
 *  - { plate, driver_name, driver_phone, route_id }
 *  - { plate, driver_name, driver_phone, route_code }
 */
router.post("/", async (req, res) => {
  try {
    const {
      plate,
      driver_name,
      driver_phone,
      route_id,
      route_code,
    } = req.body;

    if (!plate) {
      return res.status(400).json({ error: "Thiếu trường biển số 'plate'" });
    }

    // Tìm route ==========================
    let finalRouteId = route_id;

    if (!finalRouteId && route_code) {
      const route = await Route.findOne({ code: route_code });
      if (!route) {
        return res
          .status(400)
          .json({ error: `Không tìm thấy tuyến với code = ${route_code}` });
      }
      finalRouteId = route._id;
    }

    if (!finalRouteId) {
      return res
        .status(400)
        .json({ error: "Phải truyền route_id hoặc route_code" });
    }

    // Tạo bus ============================
    const bus = await Bus.create({
      plate,
      driver_name,
      driver_phone,
      route: finalRouteId,
    });

    res.status(201).json(bus);
  } catch (err) {
    console.error("POST /buses error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/buses/:id
 * Xóa 1 xe theo id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Bus.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy xe để xóa" });
    }

    res.json({
      message: "Deleted",
      id: req.params.id,
    });
  } catch (err) {
    console.error("DELETE /buses/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/buses/positions
 * Lấy vị trí realtime xe (Map sử dụng)
 */
router.get("/positions", async (req, res) => {
  try {
    const buses = await Bus.find({
      lat: { $ne: null },
      lng: { $ne: null },
    }).populate("route");

    const result = buses.map((b) => ({
      id: b.id,
      plate: b.plate,
      route_id: b.route?.id,
      route_code: b.route?.code,
      lat: b.lat,
      lng: b.lng,
      speed: b.speed || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error("GET /buses/positions error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
