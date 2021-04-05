import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { client } from "../index";
import * as helpers from "../helpers";

module.exports = class KickCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "kick",
      description: "Kicks a member.",
      requiredPermissions: ["KICK_MEMBERS"],
      options: [
        {
          type: CommandOptionType.USER,
          name: "member",
          description: "Who would you like to kick?",
          required: true,
        },
        {
          type: CommandOptionType.STRING,
          name: "reason",
          description: "What's the reason for the kick?",
          required: false,
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
    const guild = client.guilds.cache.get(ctx.guildID);
    if (!guild) {
      return ctx.send({
        embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_GUILD_NOT_FOUND")],
      });
    }
    const member = guild.members.cache.get(ctx.options.member);
    const authorMember = guild.members.cache.get(ctx.user.id);
    if (!member || !authorMember) {
      return ctx.send({
        embeds: [
          helpers.INTERNAL_ERROR_EMBED(
            authorMember
              ? "ERR_MEMBER_NOT_FOUND"
              : "ERR_AUTHOR_MEMBER_NOT_FOUND"
          ),
        ],
      });
    }

    if (member.id === ctx.user.id) {
      return ctx.send({
        embeds: [helpers.FRIENDLY_ERROR_EMBED("You can't kick yourself!")],
      });
    }
    if (
      !guild.owner.id == authorMember.id &&
      authorMember.roles.highest.position < member.roles.highest.position
    ) {
      return ctx.send({
        embeds: [
          helpers.FRIENDLY_ERROR_EMBED(
            "Your role's position is lower than the member you're trying to kick - no permission"
          ),
        ],
      });
    }
    try {
      await member.kick({
        reason: `Kicked by ${authorMember.user.tag} (${ctx.user.id}) for ${
          ctx.options.reason || "no reason provided"
        }`,
      });
    } catch (err) {
      return ctx.send({
        embeds: [
          helpers.FRIENDLY_ERROR_EMBED(
            "I don't have permissions to ban this user!"
          ),
        ],
      });
    }
    const embed = new MessageEmbed()
      .setTitle("Kicked!")
      .setDescription(
        `<@${member.user.id}> has been kicked by <@${ctx.user.id}> for ${
          ctx.options.reason || "no reason provided"
        }`
      )
      .setColor(helpers.MAIN_COLOR);
    return ctx.send({
      embeds: [embed],
    });
  }
};
