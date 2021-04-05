import { Client } from "discord.js";
import filter from "../drivers/filters/perspective";

/**
 *
 * @param {Client} client
 */
export default function filtering(client) {
  client.on("message", async (message) => {
    try {
      if (message.author.id === client.user.id) return;
      if (message.content.length === 0) return;

      const scores = await filter(message.content);
      if (scores.INSULT) message.react("🤬");
      if (scores.TOXICITY) message.react("🤮");
      if (scores.IDENTITY_ATTACK) message.react("😿");
    } catch (_) {}
  });
}
