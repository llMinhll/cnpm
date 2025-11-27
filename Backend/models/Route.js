const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },      // R3A, R7, 01,...
    name: { type: String },                      // tên tuyến (tuỳ chọn)
    start_point: { type: String },
    end_point: { type: String },
    price: { type: Number },                     // giá vé
    city: { type: String, default: "Da Nang" }
  },
  { timestamps: true }
);

// thêm field id ảo để frontend dùng r.id
routeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Route", routeSchema);
