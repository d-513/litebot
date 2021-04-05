import { SlashCommand, CommandContext } from "slash-create";

module.exports = class HelpCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "help",
      description: "Displays the help page",
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
    return `The help page for the bot is located at https://litebot.d513.space`;
  }
};
