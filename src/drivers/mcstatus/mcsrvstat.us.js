import mongoose from "mongoose";
import axios from "axios";

const Cache = mongoose.model("Cache");

export async function getStatus(server) {
  const dat = await Cache.findOne({ ca: "mc", key: server });
  if (dat) {
    return dat.value;
  } else {
    const { data } = await axios.get(`https://api.mcsrvstat.us/2/${server}`);
    await Cache.create({ ca: "mc", key: server, value: data });
    return data;
  }
}
