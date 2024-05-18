const { SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("bug-report")
    .setDescription("Report a bug to the bot developers."),
    async execute(interaction) {
        if (!interaction.guild) return await interaction.reply({ content: `\`⚠️`` You must be in a guild to run this command!`, epehemeral: true })
        
        const modal = new ModalBuilder()
        .setTitle("Bug & Command Abuse Report")
        .setCustomId("bugreport")

        const command = new TextInputBuilder()
        .setCustomId('bugreport-type')
        .setRequired(true)
        .setPlaceholder('Please enter the command in this box.')
        .setLabel('What command has a bug or is being abused?')
        .setStyle(TextInputStyle.Short)

        const description = new TextInputBuilder()
        .setCustomId('bugreport-description')
        .setRequired(true)
        .setPlaceholder('Be sure to be as detailed as possible so we can handle this problem!')
        .setLabel('Describe the bug or way it is being abused.')
        .setStyle(TextInputStyle.Paragraph)

        const one = new ActionRowBuilder().addComponents(command);
        const two = new ActionRowBuilder().addComponents(description);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    }
}