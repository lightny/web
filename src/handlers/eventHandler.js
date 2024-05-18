function loadEvents(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const path = require('path');
    require('colors');
    const table = new ascii().setHeading('Events', 'Status');

    const eventsFolder = path.join(__dirname, '../events');
    const folders = fs.readdirSync(eventsFolder);
    
    for (const folder of folders) {
        const folderPath = path.join(eventsFolder, folder);
        const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const event = require(filePath);

            if (event.rest) {
                if (event.once) {
                    client.rest.once(event.name, (...args) => {
                        event.execute(...args, client);
                    });
                }
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                table.addRow(file, 'loaded');
                continue;
            }
        }
    }

    return console.log(table.toString().green, '\n Loaded Events'.green);
}

module.exports = { loadEvents };