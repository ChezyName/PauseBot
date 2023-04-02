> It's Prob Illegal To Record People WITHOUT Permission So Do So At Your Own Risk.
# Imagine your friends say something sketch,
and you heard it, but noone else did... 
what do you do?
### Well you use this Discord Bot!

This Discord bot written in *NodeJS* was made to catch your friends and anyone in your Discord Server when they something sus.


## Installation:
Installing is simple, Just make sure you have [*NodeJS*](https://nodejs.org/en/) downloaded aswell as [*NPM*](https://www.npmjs.com/).

Once all the files are extracted, create a new file named `.env` and add the following code into it.

``` .env
DISCORD_TOKEN=ADD_YOU_DISCORD_TOKEN_HERE
```
> [How to get Discord Bot Token](https://docs.discordbotstudio.org/setting-up-dbs/finding-your-bot-token)


Once you added the token in the `.env`, just run `npm install` to install all the dependencies and then run 'npm start' and it will run the `index.js` file that creates and runs the discord bot.

## Commands:
### Joining The Server
Inside your server, running `/join` makes the bot join the voice call you are currently in, If you are not inside a voice call, the would would idle.
### Exposing Your Friends
Once the bot has been inside the call after using `/join`, you can call `/pause target:@USERNAME`, Discord auto completes `target:` so all you have to do is give it a username of who you want to expose. The bot then gives an audio file.

# What's instore for the future?
A lot of things acually, Firstly there is a bug where the audio is not always correct / sometimes corrupted, fixing that would be #1, but combining different speakers to a single file is #2.

For Example: UserA and UserB talked and you used `/export target:@UserA target:@UserB`. In order to do that, I would first need to fix the audio files not always being intact and then merge the audio files.

> Also if someone joins after using `/join` it won't record their audio


# What you can learn from this?
I would recommend trying soemthing like this to get a feel for ogg files and FFMPEG, an app to edit audio using cli only.

# Any main updates?
Currently packaging to a single EXE File is my priority as well as fixing FFMPEG corrupting the ogg files.
