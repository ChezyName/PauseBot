const { Client, GatewayIntentBits, ActivityType, Events, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const TOKEN = process.env.DISCORD_TOKEN;

let client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
});

client.login(TOKEN).then((token) => {
    // client.user is now defined
    client.user.setPresence({
        activities: [{ name: `ppl to see if they say something sus`, type: ActivityType.Watching }],
        status: '👀',
    });

    console.log("Bot Is Ready To Recieve Commands...");
});

client.on("ready",() => {
    client.channels.fetch('961009537127690303')
    .then(channel => {
        channel.send("Fancy A Cup Of Tea Yeah? 🍵");
    })
})