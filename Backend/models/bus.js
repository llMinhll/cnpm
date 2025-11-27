// models/Bus.js
const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  plate: { type: String, required: true },    // Biển số
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },

  driver_name: { type: String, default: "" },
  driver_phone: { type: String, default: "" },

  // vị trí realtime (nếu có)
  lat: Number,
  lng: Number,
  speed: Number,

  status: { type: String, default: "Đang chạy" },
});

BusSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Bus", BusSchema);
