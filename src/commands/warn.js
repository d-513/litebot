import * as helpers from "../helpers";
import { MessageAttachment, MessageEmbed } from "discord.js";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import { client } from "../index";

module.exports = class WarnCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "warn",
      description: "warning system",
      requiredPermissions: ["MANAGE_ROLES"],
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "list",
          description: "Lists the warnings of a user.",
          options: [
            {
              type: CommandOptionType.USER,
              name: "member",
              description: "User to list warns of",
              required: true,
            },
          ],
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "add",
          description: "Adds a warning to a user",
          options: [
            {
              type: CommandOptionType.USER,
              name: "member",
              description: "User to add warning to",
              required: true,
            },
            {
              type: CommandOptionType.STRING,
              name: "reason",
              description: "Reason for the warn",
              required: false,
            },
          ],
        },
      ],
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
    // this._manager = new WarningManager();
  }

  /**
   *
   * @param {CommandContext} ctx
   * @returns
   */
  async run(ctx) {
    const [cmd] = ctx.subcommands;
    switch (cmd) {
      case "list": {
        const guild = client.guilds.cache.get(ctx.guildID);
        if (!guild)
          return ctx.send({
            embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_GUILD_NOT_FOUND")],
          });

        const member = guild.members.cache.get(ctx.options.list.member);
        if (!member)
          return ctx.send({
            embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_MEMBER_NOT_FOUND")],
          });
        const list = await this._manager.getWarns(
          ctx.options.list.member,
          ctx.guildID
        );
        const embed = new MessageEmbed()
          .setTitle(`${member.user.username}'s warnings`)
          .setColor(helpers.MAIN_COLOR);
        if (!list[0]) {
          embed.setDescription("This member has no warnings");
          return ctx.send({ embeds: [embed.toJSON()] });
        }
        let msg = "";
        list.forEach((warn, i) => {
          msg += `**${i + 1}**. <@${member.user.id}> warned by <@${
            warn.giver_id
          }> for ${warn.reason}\n`;
        });
        embed.setDescription(msg);
        return ctx.send({ embeds: [embed.toJSON()] });
      }
      case "add": {
        const guild = client.guilds.cache.get(ctx.guildID);
        if (!guild) {
          return ctx.send({
            embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_GUILD_NOT_FOUND")],
          });
        }
        const member = guild.members.cache.get(ctx.options.add.member);
        if (!member) {
          return ctx.send({
            embeds: [helpers.INTERNAL_ERROR_EMBED("ERR_MEMBER_NOT_FOUND")],
          });
        }
        await this._manager.addWarn(
          ctx.guildID,
          ctx.options.add.member,
          ctx.user.id,
          ctx.options.add.reason || "no reason provided"
        );

        const embed = new MessageEmbed()
          .setColor(helpers.MAIN_COLOR)
          .setAuthor(ctx.user.username, ctx.user.avatarURL)
          .setDescription(
            `<@${ctx.user.id}> has warned <@${member.user.id}> for ${
              ctx.options.add.reason || "no reason provided"
            }`
          );
        return ctx.send({ embeds: [embed.toJSON()] });
      }
    }
  }
};
