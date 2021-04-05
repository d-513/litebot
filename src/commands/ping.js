import { SlashCommand } from "slash-create";
import { client } from "../index";

module.exports = class PingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "botping",
      description: "Says the bot ping.",
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx) {
    ctx.defer(true);
    ctx.send(`Current bot ping is ${client.ws.ping}ms`);
  }
};
