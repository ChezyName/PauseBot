const { Client, GatewayIntentBits, ActivityType, Events, Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


function loadAllCommands(client,TOKEN){
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    //Registering GLOBAL Commands
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    rest.put(
        Routes.applicationCommands(client.application.id),
        { body: commands },
    );
}

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
            
            loadAllCommands(client,TOKEN);

            console.log("Bot Is Ready To Recieve Commands...");
        });


        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
        
            const command = interaction.client.commands.get(interaction.commandName);
        
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
        
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
}

module.exports = DiscordClient;