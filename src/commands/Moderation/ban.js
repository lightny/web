const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a player from the Roblox game.')
    .addStringOption((o) =>
      o
        .setName('id')
        .setDescription('The id of the user to ban from the Roblox game.')
        .setRequired(true)
    ),
  async execute(interaction) {
    async function uploadJSONToJSONBin(jsonData) {
        const apiKey = '$2a$10$eJfrGVec6kjQDxl6pTtO1uNMBoOSRx.TMOijV/IkfbnRutn.dV4Va';
        const url = 'https://api.jsonbin.io/v3/b';

        try {
            console.log('Uploading JSON data to JSONBin...');
            const response = await axios.post(url, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                }
            });

            const binId = response.data.metadata.id;
            console.log('Successfully uploaded JSON data. Bin ID:', binId);
            const Bin = require('../../models/banData');
            const binn = new Bin({ binId: binId });
            await binn.save();
            console.log('Bin ID saved to MongoDB.');
            const localServerResponse = await axios.post('https://my-ban-bot-test-1.vercel.app/updateBinId', { binId: binId });
            console.log('Local server response:', localServerResponse.data);
            return `https://api.jsonbin.io/v3/b/${binId}`;
        } catch (error) {
            console.error('Error uploading JSON to JSONBin:', error);
            throw error;
        }
    }

    try {
      console.log('Command execution started.');
      const userId = interaction.options.getString('id');
      console.log('User ID to ban:', userId);

      const jsonData = { userId: userId };
      const binUrl = await uploadJSONToJSONBin(jsonData);

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Successfully banned player!')
        .setDescription(`I've successfully banned ${userId} from the game!`);

      console.log('Replying with embed:', embed);
      await interaction.reply({ embeds: [embed] });
      console.log('Command execution completed successfully.');
    } catch (error) {
      console.error('Error in command execution:', error);
      await interaction.reply('There was an error while executing the command.');
    }
  },
};
