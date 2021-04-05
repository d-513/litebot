import * as helpers from "../helpers";
import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { getStatus } from "../drivers/mcstatus/mcsrvstat.us";

module.exports = class MinecraftCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "minecraft",
      description: "Useful minecraft-related commands",
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "ping",
          description: "Pings a minecraft server",
          options: [
            {
              type: CommandOptionType.STRING,
              name: "address",
              description: "Server address",
              required: true,
            },
          ],
        },
      ],
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
    try {
      const addr = ctx.options.ping.address;
      const status = await getStatus(addr);
      const embed = new MessageEmbed()
        .setTitle(`${addr} status`)
        .setColor(helpers.MAIN_COLOR);

      if (!status.online) {
        embed
          .setColor(helpers.ERROR_COLOR)
          .addField("Offline!", "We weren't able to ping that server!");
      } else {
        embed
          .setDescription(status.motd.clean)
          .addField(
            "PLAYERS ONLINE",
            `${status.players.online}/${status.players.max}`
          )
          .addField("VERSION", status.version);
      }

      if (status.hostname) embed.addField("HOSTNAME", status.hostname, true);
      if (status.ip) embed.addField("IP", status.ip, true);
      if (status.port) embed.addField("PORT", status.port, true);
      if (status.software) embed.addField("SOFTWARE", status.software);
      return ctx.send({
        embeds: [embed.toJSON()],
      });
    } catch (err) {
      console.log(err);
    }
  }
};
