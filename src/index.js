const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Collection,
  Events,
} = require("discord.js");
require("colors");
require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

app.enable("trust proxy");
app.set("etag", false);
app.use(express.static(__dirname + "./dashboard"));

const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");

const mConfig = require("./config.json");
const blacklistUser = require("./models/blacklistUser");
const { totalmem } = require("os");
const { FILE } = require("dns");



client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return interaction.reply({
      content: `\`❌\` This command is outdated, please try again in a few minutes.`,
      ephemeral: true,
    });
  }

  if (command.checkMod) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      const noPEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("System Error")
        .setDescription(
          `\`❌\` There has been an error performing this action. This reason may be caused by you not having the correct permissions to proceed with this action.`
        )
        .setFooter({ text: `Vexta Moderation` })
        .setTimestamp();

      return interaction.reply({ embeds: [noPEmbed], ephemeral: true });
    }
  }

  if (command.testMode) {
    if (!mConfig.testerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: mConfig.commandTestMode,
        ephemeral: true,
      });
    }
  }

  if (command.devMode) {
    if (!mConfig.testerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: mConfig.commandDevOnly,
        ephemeral: true,
      });
    }
  }

  command.execute(interaction, client);
});

client.login(process.env.token).then(() => {
  loadCommands(client);
  loadEvents(client);
});

let binId = '';
const Bin = require('./models/banData');

app.get('/getBinId', async (req, res) => {
  try {
      const latestBin = await Bin.findOne().sort({ _id: -1 }).exec();
      if (latestBin) {
          res.json({ binId: latestBin.binId });
      } else {
          res.json({ binId: '' });
      }
  } catch (error) {
      console.error('Error fetching Bin ID from MongoDB:', error);
      res.status(500).send('Error fetching Bin ID');
  }
});

app.get('/getBinId', (req, res) => {
    res.json({ binId: binId });
});

app.get('/', async (req, res) => {
  try {
      // Fetch the Bin ID from your schema
      const bin = await Bin.findOne();
      // Render the HTML template with the Bin ID injected
      res.render('index', { binId: bin ? bin.id : 'No Bin ID set' });
  } catch (error) {
      console.error('Error fetching Bin ID:', error);
      res.status(500).send('Error loading Bin ID');
  }
});

app.listen(3000, () => {
    console.log(`Server running at https://lightny.github.io/web/`);
});


// app.get("/", async (req, res) => {
//   const indexPath = path.join(__dirname, "dashboard", "index.html");
//   const serverCount = client.guilds.cache.size;
//   const userCount = client.users.cache.size;
//   const channelCount = client.channels.cache.size;

//   fs.readFile(indexPath, { encoding: "utf8" }, (err, data) => {
//     if (err) {
//       console.error("Error reading HTML file:", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     let file = data.replace("$servers$", serverCount);
//     file = file.replace("$users$", userCount);
//     file = file.replace("$channels$", channelCount);

//     res.send(file);
//   });
// });

// app.get("*", (req, res) => {
//   res.sendFile(__dirname + "/dashboard/404.html");
// });

// app.get("/commands_redirect", async (req, res) => {
//   res.redirect("/dashboard/commands.html");
// });

// app.listen(process.env.PORT || 90, () =>
//   console.log(`App listening on port ${process.env.PORT || 90}`.green)
// );
