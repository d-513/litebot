import * as helpers from "../helpers";
import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandContext, CommandOptionType } from "slash-create";
import CovidClient from "../drivers/covid/disease.sh";
import moment from "moment";

const covid = new CovidClient();

module.exports = class CovidCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "covid",
      description: "Shows COVID-19 stats",
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "all",
          description: "Show covid stats for all countries",
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "country",
          description: "Show covid stats for a country",
          options: [
            {
              type: CommandOptionType.STRING,
              name: "countryname",
              description: "Name of the country",
              required: true,
            },
          ],
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "state",
          description: "Show covid stats for a US state",
          options: [
            {
              type: CommandOptionType.STRING,
              name: "statename",
              description: "Name of the state",
              required: true,
            },
          ],
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "continent",
          description: "Show covid stats for a continent",
          options: [
            {
              type: CommandOptionType.STRING,
              name: "continentname",
              description: "Name of the continent",
              required: true,
            },
          ],
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "top",
          description: "Show top 5 covid infected countries",
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
    const [command] = ctx.subcommands;
    switch (command) {
      case "all": {
        const data = await covid.all();
        const embed = new MessageEmbed()
          .setAuthor("Global COVID-19 Stats", "https://i.imgur.com/fsYnLQb.png")
          .setThumbnail("https://i.imgur.com/fsYnLQb.png")
          .setColor(helpers.MAIN_COLOR)
          .addField("Cases", data.cases)
          .addField("Deaths", data.deaths)
          .addField("Recovered", data.recovered)
          .addField("Active cases", data.active)
          .addField("Critical cases", data.critical)
          .addField("Tests", data.tests)
          .addField("Affected countries", data.affectedCountries)
          .addField("Updated", moment(data.updated).fromNow());
        return ctx.send({
          embeds: [embed.toJSON()],
        });
      }
      case "country": {
        try {
          const data = await covid.country(ctx.options.country.countryname);
          const embed = new MessageEmbed()
            .setAuthor(`${data.country} COVID-19 Stats`, data.countryInfo.flag)
            .setColor(helpers.MAIN_COLOR)
            .addField("Country", data.country)
            .addField("Continent", data.continent)
            .addField("Cases", data.cases)
            .addField("Deaths", data.deaths)
            .addField("Recovered", data.recovered)
            .addField("Active cases", data.active)
            .addField("Critical cases", data.critical)
            .addField("Tests", data.tests)
            .addField("Updated", moment(data.updated).fromNow())
            .setThumbnail(data.countryInfo.flag);
          return ctx.send({ embeds: [embed.toJSON()] });
        } catch (err) {
          return ctx.send({
            embeds: [helpers.FRIENDLY_ERROR_EMBED("Incorrect country code.")],
          });
        }
      }
      case "state": {
        try {
          const data = await covid.state(ctx.options.state.statename);
          const embed = new MessageEmbed()
            .setAuthor(
              `${data.state} COVID-19 Stats`,
              "https://i.imgur.com/SzmZlwj.png"
            )
            .setColor(helpers.MAIN_COLOR)
            .addField("State", data.state)
            .addField("Cases", data.cases)
            .addField("Deaths", data.deaths)
            .addField("Recovered", data.recovered)
            .addField("Active cases", data.active)
            .addField("Critical cases", data.critical)
            .addField("Tests", data.tests)
            .addField("Updated", moment(data.updated).fromNow())
            .setThumbnail("https://i.imgur.com/SzmZlwj.png");
          return ctx.send({ embeds: [embed.toJSON()] });
        } catch (err) {
          return ctx.send({
            embeds: [helpers.FRIENDLY_ERROR_EMBED("Incorrect state code.")],
          });
        }
      }
      case "continent": {
        try {
          const data = await covid.continent(
            ctx.options.continent.continentname
          );
          const embed = new MessageEmbed()
            .setAuthor(`${data.continent} COVID-19 Stats`)
            .setColor(helpers.MAIN_COLOR)
            .addField("Continent", data.continent)
            .addField("Cases", data.cases)
            .addField("Deaths", data.deaths)
            .addField("Recovered", data.recovered)
            .addField("Active cases", data.active)
            .addField("Critical cases", data.critical)
            .addField("Tests", data.tests)
            .addField("Updated", moment(data.updated).fromNow());
          return ctx.send({ embeds: [embed.toJSON()] });
        } catch (err) {
          return ctx.send({
            embeds: [helpers.FRIENDLY_ERROR_EMBED("Incorrect continent code.")],
          });
        }
      }
      case "top": {
        try {
          let data = await covid.countries();
          data = data.slice(0, 5);
          const embed = new MessageEmbed()
            .setTitle("Top 5 infected countries")
            .setColor(helpers.MAIN_COLOR);
          data.forEach((country, i) => {
            embed.addField(
              `${i + 1}. ${country.country}`,
              `${country.cases} infected, ${country.deaths} dead, ${country.recovered} recovered`
            );
          });
          embed.addField("Updated", moment(data[0].updated).fromNow());
          return ctx.send({ embeds: [embed.toJSON()] });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
};
