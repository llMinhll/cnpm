const mongoose = require("mongoose");
const { Schema } = mongoose;

const stopSchema = new Schema(
  {
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    stop_order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

stopSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Stop", stopSchema);
