const { Client, GatewayIntentBits, ActivityType } = require('discord.js');


class DiscordClient {
    constructor(TOKEN){
        this.token = TOKEN

        let client = new Client({
            intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
        });
        this.client = client;


        client.login(TOKEN).then((token) => {
            // client.user is now defined
            client.user.setPresence({
                activities: [{ name: `ppl to see if they say something sus`, type: ActivityType.Watching }],
                status: '👀',
            });
        });
    }
}

module.exports = DiscordClient;