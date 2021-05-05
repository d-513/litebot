import mongoose, { Schema } from "mongoose";
import { uid } from "uid";

const Warn = Schema({
  id: {
    type: String,
    default: () => uid(5),
  },
  gid: String,
  uid: String,
  giver_id: String,
  reason: {
    type: String,
    default: "no reason provided",
  },
});
