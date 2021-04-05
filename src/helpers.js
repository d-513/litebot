import { MessageEmbed } from "discord.js";
export const MAIN_COLOR = "#7289DA";
export const ERROR_COLOR = "#b22222";

export function INTERNAL_ERROR_EMBED(code) {
  const embed = new MessageEmbed()
    .setTitle("ERROR")
    .setColor(ERROR_COLOR)
    .setDescription(`An internal error has happened!\n${code}`);
  return embed.toJSON();
}

export function FRIENDLY_ERROR_EMBED(message) {
  const embed = new MessageEmbed()
    .setTitle("ERROR")
    .setColor(ERROR_COLOR)
    .setDescription(message);
  return embed.toJSON();
}
