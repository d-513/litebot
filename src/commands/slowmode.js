import * as helpers from "../helpers";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { client } from "../index";
import { MessageEmbed } from "discord.js";

module.exports = class SlowModeCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "slowmode",
      description: "Sets a slowmode on the channel.",
      requiredPermissions: ["MANAGE_CHANNELS"],
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: "delay",
          description: "How much users have to wait between sending messages",
          required: true,
        },
      ],
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  /**
   *
   * @param {CommandContext} ctx
   */
  async run(ctx) {
    const channel = client.channels.cache.get(ctx.channelID);
    if (!channel)
      return ctx.send({
        embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_CHANNEL_NOT_FOUND")],
      });
    channel.setRateLimitPerUser(
      ctx.options.delay,
      `Requested by ${ctx.user.id}`
    );
    const embed = new MessageEmbed()
      .setTitle("Done!")
      .setDescription(`Slowmode set to ${ctx.options.delay}s`)
      .setColor(helpers.MAIN_COLOR);
    return ctx.send({ embeds: [embed.toJSON()] });
  }
};
