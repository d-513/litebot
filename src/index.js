import { Creator, GatewayServer } from "slash-create";
import Discord from "discord.js";
import path from "path";
import filteringModule from "./modules/filtering";
import "./web";

export const client = new Discord.Client();

client.once("ready", () => {
  console.log("Bot ready");
  filteringModule(client);
});
const creator = new Creator({
  applicationID: process.env.BOT_APPID,
  publicKey: process.env.BOT_PUBKEY,
  token: process.env.BOT_TOKEN,
});

creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands()
  .syncCommandsIn("828545875160727563");
client.login(process.env.BOT_TOKEN);
