const { joinVoiceChannel, EndBehaviorType } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { OggLogicalBitstream, OpusHead } = require("prism-media/dist/opus");
const { pipeline } = require("stream");

// Joins the voice call of who called the command

function createAudioFile(voiceReceiver,member){
    const opusStream = voiceReceiver.subscribe(member.id,{
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000,
        },
    });

    const oggStream = new OggLogicalBitstream({
        opusHead: new OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const filename = `./recordings/${member.id}/${Date.now()}.ogg`;

    if(!fs.existsSync(path.join(__dirname,"../recordings",member.id))) fs.mkdirSync(path.join(__dirname,"../recordings",member.id));

    const out = fs.createWriteStream(filename);

    pipeline(opusStream, oggStream, out, (err) => {
        if(!err){
            opusStream.destroy();
            oggStream.destroy();
            createAudioFile(voiceReceiver,member);
        }
    });
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('joins the call that you are currently in.'),
	async execute(interaction) {
        if(interaction.member.voice.channel != null){
            let call = interaction.member.voice.channel.name;
            let callID = interaction.member.voice.channel.id;
            let guild = interaction.member.voice.channel.guild;
    
            if(call){
                let m = "Joining " + interaction.member.nickname + " @ " + call;
                await interaction.reply({ content: m, ephemeral: true });
    
                const connection = joinVoiceChannel({
                    channelId: callID,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: true,
                });
                
                let vc = interaction.client.channels.cache.get(callID)
                const voiceReceiver = connection.receiver;

                //Record Everyone
                vc.members.forEach((member) => {
                    //Stop if client is the member
                    if(member.id == interaction.client.id) return;
                    createAudioFile(voiceReceiver,member);
                });
            }
        }
        else{
            let m = "Cannot Join " + interaction.member.nickname + ".";
            await interaction.reply({ content: m, ephemeral: true });
        }
	},
};