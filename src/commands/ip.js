import * as helpers from "../helpers";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { MessageEmbed } from "discord.js";
import IPInfo from "node-ipinfo";

const ipinfo = new IPInfo(process.env.IPINFO_TOKEN);

module.exports = class IPInfoCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "ip",
      description: "Shows information about an IP address.",
      options: [
        {
          type: CommandOptionType.STRING,
          name: "ip",
          description: "The IP address",
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
    try {
      const res = await ipinfo.lookupIp(ctx.options.ip);
      const embed = new MessageEmbed()
        .setTitle(`IP Info`)
        .setColor(helpers.MAIN_COLOR)
        .addField("IP", res.ip)
        .addField("Hostname", res.hostname)
        .addField("City", res.city)
        .addField("Region", res.region)
        .addField("Country", res.country)
        .addField("Location", res.loc)
        .addField("Organization", res.org)
        .addField("Postal code", res.postal)
        .addField("Timezone", res.timezone);
      return ctx.send({
        embeds: [embed.toJSON()],
      });
    } catch (_) {
      return ctx.send({
        embeds: [helpers.FRIENDLY_ERROR_EMBED("Unknown IP address")],
      });
    }
  }
};
