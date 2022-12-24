const { OpusEncoder } = require("@discordjs/opus");
const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const audioconcat = require('audioconcat');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function ConvertToMP3(OldFile){
	return new Promise((resolve) => {
		ffmpeg(OldFile)
		.toFormat('mp3')
		.on('end', () => {
			resolve();
		})
		.save(OldFile.replace(".ogg",".mp3"));
	});
}



const OpusEncode = new OpusEncoder(48000,2);
async function recursiveStreamWriter(inputFiles,interaction,stream,fileLoc,displayName,Chunks) {
    if(inputFiles.length == 0) {
		await interaction.editReply({
			content: "Audio Files For " + displayName,
			files: [fileLoc],
		});

		let NFL = fileLoc.replace(".ogg","-FINAL.ogg");
		fs.writeFileSync(NFL,Buffer.from(Chunks));


		const { parseFile } = await import("music-metadata");
		let P = await parseFile(NFL);
		console.log(P)
		
		await interaction.editReply({
			content: "Audio Files For " + displayName,
			files: [NFL,fileLoc],
		});

		//Remove File
		await fs.unlinkSync(fileLoc);
        return;
    }

    let nextFile = inputFiles.shift(); 
    var readStream = fs.createReadStream(nextFile);

	const { default: CodecParser } = await import("codec-parser");
	const mimeType = "audio/ogg";
	const options = {
		onCodec: () => {},
		onCodecUpdate: () => {},
		enableLogging: true
	};

	const parser = new CodecParser(mimeType, options);

	let audioBuffer = await fs.readFileSync(nextFile);
	let frames = parser.parseAll(audioBuffer);
	//console.log("<==================================================>")
	//console.log(frames);
	for(var i = 0; i < frames.length; i++){
		Chunks.push(frames[i].rawData);
	}


	readStream.pipe(stream, {end: false});
	readStream.on("data",(chunk) => {
		//Chunks += (OpusEncode.decode(chunk));
	});
    readStream.on('end',async () => {
        //console.log('Finished streaming an audio file');
        recursiveStreamWriter(inputFiles,interaction,stream,fileLoc,displayName,Chunks);
    });
}

async function AudioConcatFiles(files,FinalLocation,interaction,displayName){
	const { parseBuffer } = await import("music-metadata");
	
	//set file path based on OS
	//console.log(files);
	audioconcat(files)
		.concat(FinalLocation)
		.on('start', function (command) {
			//console.log('ffmpeg process started:', command)
		})
		.on('error', function (err, stdout, stderr) {
			//console.error('Error:', err)
			//console.error('ffmpeg stderr:', stderr)
		})
		.on('end', async function (output) {
			//console.error('Audio created in:', output)
			await interaction.editReply({
				content: "Audio Files For " + displayName,
				files: [FinalLocation],
			});

			await fs.unlinkSync(FinalLocation);
		})
}

// Joins the voice call of who called the command
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pausev2')
		.setDescription('used if pause v1 not working')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to sus out')
				.setRequired(true)),
	async execute(interaction,DiscordClient) {
        let call = interaction.member.voice.channel.name;
        let callID = interaction.member.voice.channel.id;
        let guild = interaction.member.voice.channel.guild;
		let UID = interaction.options.getUser('target').id;
		let displayName = guild.members.cache.get(UID).displayName.replace(" ","_");

		await interaction.reply("Loading up audio file for "+displayName);

		let userPath = path.join(__dirname,"../recordings",UID);
		if(!fs.existsSync(userPath)){
			await interaction.editReply("User is NOT in call / Files not found.")
			return
		}
		let audioFiles = fs.readdirSync(userPath, { withFileTypes: true });
			
		let combineFiles = [];

		//get the files
		const { parseBuffer } = await import("music-metadata");
		for(var i = 0; i < audioFiles.length; i++){
			let audioFile = audioFiles[i];
			let FileName = audioFile.name.replace(".ogg","");

			let fileBuffer = await fs.readFileSync(path.join(userPath,audioFile.name));
			if(parseInt(FileName) - Date.now() < -30000){
				let FileData = await parseBuffer(fileBuffer);
				//console.log(FileData);
				if(FileData.format.duration > 1){
					combineFiles.push(path.join(userPath,audioFile.name));
					//ConvertToMP3(path.join(userPath,audioFile.name));
				}
			}
		}

		//console.log(combineFiles);

		//send combined files
		if(combineFiles.length == 0){
			await interaction.editReply({
				content: "NO Audio Files For " + displayName,
			});
		}
		else{
			await interaction.editReply({
				content: "v2: Audio Files For" + displayName,
				files: combineFiles,
			});
		}
	},
};