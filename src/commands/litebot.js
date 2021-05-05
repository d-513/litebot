import { SlashCommand, CommandContext } from "slash-create";

module.exports = class Command extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "litebot",
      description: "Info about the bot",
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
    return [
      "**LITEBOT**",
      "A multipurpose Discord bot with slash commands",
      "",
      "[Invite](<https://discord.com/api/oauth2/authorize?client_id=828532993592262676&permissions=8&scope=bot%20applications.commands>)",
      "[GitHub](<https://github.com/dada513/litebot>)",
    ].join("\n");
  }
};
