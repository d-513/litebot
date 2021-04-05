import { Cache } from "../database/sqlite";
import axios from "axios";

const statusCache = new Cache("mcstatus", 1000 * 60 * 60);
export async function getStatus(server) {
  if (await statusCache.get(server)) {
    return JSON.parse(await statusCache.get(server));
  } else {
    const { data } = await axios.get(`https://api.mcsrvstat.us/2/${server}`);
    await statusCache.set(server, JSON.stringify(data));
    return data;
  }
}
