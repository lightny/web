const {
  EmbedBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.guild || !interaction.isModalSubmit) return;

    if (interaction.customId === "bugreport") {
      const command = interaction.fields.getTextInputValue("bugreport-type");
      const description = interaction.fields.getTextInputValue(
        "bugreport-description"
      );

      const id = interaction.user.id;
      const member = interaction.member;
      const server = interaction.guild;

      const channel = await client.channels.cache.get("1214571383099621386");

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("New Bug Report")
        .addFields({
          name: "Reporting Member",
          value: `\`${member.user.username} (${id})\``,
        })
        .addFields({
          name: "Reporting Guild",
          value: `\`${server.name} (${server.id})\``,
        })
        .addFields({ name: "Command", value: `> ${command}` })
        .addFields({ name: "Report Description", value: `> ${description}` })
        .setFooter({ text: `Bug Report System` })
        .setTimestamp();

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`bugSolved - ${member.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
            .setLabel(`Mark as Solved`),

            new ButtonBuilder()
            .setCustomId(`pendingFix - ${member.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⚠️')
            .setLabel('Mark as Pending')
        );

        await channel.send({ embeds: [embed], components: [button] }).catch(err => {});
        await interaction.reply({ content: `\`✅\` You report has been sent to the developers. The developers will look into this issue, and reach out with any other questions for you!`, ephemeral: true });
    }
  },
};
