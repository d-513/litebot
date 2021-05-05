import mongoose, { Schema } from "mongoose";

const Cache = Schema({
  ca: String,
  key: String,
  value: Object,
  createdAt: {
    type: Date,
    expires: "10m",
    default: Date.now,
  },
});

mongoose.model("Cache", Cache);
