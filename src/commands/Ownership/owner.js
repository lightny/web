const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadCommands } = require("../../handlers/commandHandler");
const { default: axios } = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("owner")
    .setDescription("A bunch of commands for the owner of this bot only.")
    .addSubcommand((s) =>
      s.setName("reload-commands").setDescription("Reloads the bot commands.")
    ),
  devMode: true,
  async execute(interaction, client) {
    const eEmbed = new EmbedBuilder();
    const rEmbed = new EmbedBuilder();
    const { options, guildId } = interaction;
    const subcmd = options.getSubcommand();

    switch (subcmd) {
      case "reload-commands":
        rEmbed
          .setColor("Blue")
          .setTitle("System Waiting")
          .setDescription(
            "Reloading all commands.. \n Estimated Duration: 2 seconds..."
          )
          .setTimestamp();

        interaction.reply({ embeds: [rEmbed] });

        setTimeout(() => {
          loadCommands(client);
          rEmbed
            .setColor("DarkGreen")
            .setTitle("System Success")
            .setDescription("Successfully reloaded all the commands.")
            .setTimestamp();

          interaction.editReply({ embeds: [rEmbed] });
        }, 2000);
    break;
    }
  },
};
