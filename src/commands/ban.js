import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { client } from "../index";
import * as helpers from "../helpers";

module.exports = class BanCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "ban",
      description: "Bans a member.",
      requiredPermissions: ["BAN_MEMBERS"],
      options: [
        {
          type: CommandOptionType.USER,
          name: "member",
          description: "Who would you like to ban?",
          required: true,
        },
        {
          type: CommandOptionType.STRING,
          name: "reason",
          description: "What's the reason for the ban?",
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
        embeds: [helpers.FRIENDLY_ERROR_EMBED("You can't ban yourself!")],
      });
    }
    if (
      !guild.owner.id == authorMember.id &&
      authorMember.roles.highest.position < member.roles.highest.position
    ) {
      return ctx.send({
        embeds: [
          helpers.FRIENDLY_ERROR_EMBED(
            "Your role's position is lower than the member you're trying to ban - no permission"
          ),
        ],
      });
    }
    try {
      await member.ban({
        reason: `Banned by ${authorMember.user.tag} (${ctx.user.id}) for ${
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
      .setTitle("The ban hammer has spoken!")
      .setImage(
        "https://media.tenor.com/images/c1f4dbd4943275cda467b12c9f4aa7c2/tenor.gif"
      )
      .setDescription(
        `<@${member.user.id}> has been banned by <@${ctx.user.id}> for ${
          ctx.options.reason || "no reason provided"
        }`
      )
      .setColor(helpers.MAIN_COLOR);
    return ctx.send({
      embeds: [embed],
    });
  }
};
