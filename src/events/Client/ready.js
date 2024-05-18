const { Client } = require('discord.js');
const mongoose = require('mongoose');
require('colors');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(process.env.mongodbURL || '').then(() => {
            console.log(`Client has connected to the database.`.green)
        })
        console.log(`${client.user.username} is online!`.green);
    }
}