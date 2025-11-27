const express = require("express");
const auth = require("../middleware/auth");
const FavoriteRoute = require("../models/FavoriteRoute");
const Route = require("../models/Route");

const router = express.Router();

// GET /api/customer/favorites/routes
router.get("/favorites/routes", auth, async (req, res) => {
  try {
    const favorites = await FavoriteRoute.find({ user: req.user._id }).populate("route");
    const result = favorites.map((f) => f.route.toJSON());
    res.json(result);
  } catch (err) {
    console.error("GET favorites/routes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/customer/favorites/routes { route_id }
router.post("/favorites/routes", auth, async (req, res) => {
  try {
    const { route_id } = req.body;
    if (!route_id) return res.status(400).json({ error: "Thiếu route_id" });

    const route = await Route.findById(route_id);
    if (!route) return res.status(404).json({ error: "Route not found" });

    await FavoriteRoute.findOneAndUpdate(
      { user: req.user._id, route: route_id },
      { user: req.user._id, route: route_id },
      { upsert: true, new: true }
    );

    res.json({ message: "Added to favorites" });
  } catch (err) {
    console.error("POST favorites/routes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/customer/favorites/routes/:routeId
router.delete("/favorites/routes/:routeId", auth, async (req, res) => {
  try {
    await FavoriteRoute.findOneAndDelete({
      user: req.user._id,
      route: req.params.routeId,
    });
    res.json({ message: "Removed" });
  } catch (err) {
    console.error("DELETE favorites/routes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
