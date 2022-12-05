const { joinVoiceChannel } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');

async function recursiveStreamWriter(inputFiles,interaction,stream,fileLoc,displayName) {

    if(inputFiles.length == 0) {
		await interaction.editReply({
			content: "Audio Files For " + displayName,
			files: [fileLoc],
		});
		//Remove File
		fs.unlinkSync(fileLoc);
        return;
    }

    let nextFile = inputFiles.shift(); 
    var readStream = fs.createReadStream(nextFile);

    readStream.pipe(stream, {end: false});
    readStream.on('end', () => {
        //console.log('Finished streaming an audio file');
        recursiveStreamWriter(inputFiles,interaction,stream,fileLoc,displayName);
    });
}

// Joins the voice call of who called the command
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancelall')
		.setDescription('gives back audio from everyone in VC'),
	async execute(interaction,DiscordClient) {
        let call = interaction.member.voice.channel.name;
        let callID = interaction.member.voice.channel.id;
        let guild = interaction.member.voice.channel.guild;
		let UID = interaction.options.getUser('target').id;
		let displayName = guild.members.cache.get(UID).displayName.replace(" ","_");

		await interaction.reply("Loading up audio file for "+displayName);

		let userPath = path.join(__dirname,"../recordings",UID);

		let audioFiles = fs.readdirSync(userPath, { withFileTypes: true });
			
		let combineFiles = [];

		//get the files
		for(var i = 0; i < audioFiles.length; i++){
			let audioFile = audioFiles[i];
			let FileName = audioFile.name.replace(".ogg","");
			if(parseInt(FileName) - Date.now() < -30000){
				//Delete file, its expired.
				combineFiles.push(path.join(userPath,audioFile.name))
			}
		}

		console.log(combineFiles);

		//send combined files
		if(combineFiles.length == 0){
			await interaction.editReply({
				content: "NO Audio Files For " + displayName,
			});
		}
		else{
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			let DateNow = dd + "-" + mm + "-" + yyyy;

			let FLoc = path.join("./recordings",displayName+"-"+DateNow+".ogg");
			recursiveStreamWriter(combineFiles,interaction,fs.createWriteStream(FLoc),FLoc,displayName);
		}
	},
};