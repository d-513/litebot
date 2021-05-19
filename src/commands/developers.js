import { SlashCommand, CommandContext } from "slash-create";

module.exports = class DevelopersCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "developers",
      description: "Displays the developers currently working on LiteBot",
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  /**
   *
   * @param {CommandContext} ctx
   * @returns
   */
  async run(ctx) {
    ctx.defer(true);
    return `The current developers for LiteBot are: dada513, Proteus, TheBotlyNoob, And MTGSquad. *psst! join the litebot discord here: https://discord.gg/hAxySJxdKr*`;
  }
};
