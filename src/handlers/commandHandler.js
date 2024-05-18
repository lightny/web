function loadCommands(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const path = require('path');
    require('colors');
    const table = new ascii().setHeading("Commands", "Status");

    let commandsArray = [];

    const commandsFolder = fs.readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandsFolder) {
        const folderPath = path.join(__dirname, `../commands/${folder}`);
        const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const commandFile = require(filePath);

            client.commands.set(commandFile.data.name, commandFile);

            const commandData = commandFile.data.toJSON();
            commandsArray.push(commandData);

            table.addRow(commandData.name, "loaded");
        }
    }

    client.application.commands.set(commandsArray);

    return console.log(table.toString().green, "\n Loaded Commands".green);
}

module.exports = {loadCommands};