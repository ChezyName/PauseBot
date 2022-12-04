const { joinVoiceChannel } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");

// Joins the voice call of who called the command

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('gives back audio from target if they said something sus.'),
	async execute(interaction,DiscordClient) {
        let call = interaction.member.voice.channel.name;
        let callID = interaction.member.voice.channel.id;
        let guild = interaction.member.voice.channel.guild;

        console.log(DC);
	},
};