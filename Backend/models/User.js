const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    full_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // bcrypt hash
    role: { type: String, default: "admin" } // có thể: admin / driver / customer
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password; // ẩn mật khẩu
  }
});

module.exports = mongoose.model("User", UserSchema);
