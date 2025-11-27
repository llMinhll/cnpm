const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteRouteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
  },
  { timestamps: true }
);

favoriteRouteSchema.index({ user: 1, route: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteRoute", favoriteRouteSchema);
