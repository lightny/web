const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("community")
    .setDescription("All of the community commands.")
    .addSubcommand((s) =>
      s.setName("bot-info").setDescription("Display the bot's information.")
    ),
  async execute(interaction, client) {
    const { options, guild, guildId } = interaction;
    const subcmd = options.getSubcommand();

    const embed = new EmbedBuilder();

    switch (subcmd) {
      case "bot-info":
        embed
          .setColor("White")
          .setTitle(`${client.user.username}'s Information`)
          .addFields({
            name: `Latency`,
            value: `🏓 ${client.ws.ping}ms`,
          });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;
    }
  },
};
