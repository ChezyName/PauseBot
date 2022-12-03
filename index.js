require('dotenv').config()
const DiscordClient = require("./discordbot");

let client = new DiscordClient(process.env.DISCORD_TOKEN);