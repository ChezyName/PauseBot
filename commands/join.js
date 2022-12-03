const { joinVoiceChannel } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");

// Joins the voice call of who called the command

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('joins the call that you are currently in.'),
	async execute(interaction) {
        let call = interaction.member.voice.channel.name;
        let callID = interaction.member.voice.channel.id;
        let guild = interaction.member.voice.channel.guild;

        if(call){
            await interaction.reply("Joining " + interaction.member.nickname + " @ " + call);

            joinVoiceChannel({
                channelId: callID,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: true,
            });
        }
        else{
            await interaction.reply("Cannot Join " + interaction.member.nickname + ".");
        }
	},
};