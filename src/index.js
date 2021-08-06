const { Client, Message } = require("discord.js");
const { DiscordSR } = require("discord-speech-recognition");
const ytdl = require("ytdl-core");

const client = new Client();
new DiscordSR(client);

const { token, speech } = require("./loadConfig");

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.member.bot) return;
  if (oldState.channelID === newState.channelID) return;
  if (!(oldState.channelID || newState.channelID)) return;

  if (oldState.channel) {
    await tryToLeaveOldStateChannel(oldState);
    if (newState.channel) tryToJoinNewStateChannel(newState);
    return;
  }

  tryToJoinNewStateChannel(newState);
});

async function tryToLeaveOldStateChannel(oldState) {
  const connection = guildConnection(oldState.guild);
  if (!connection) return;
  if (!connection.channel.members.find((member) => !member.user.bot))
    oldState.channel.leave();
  await sleep(500);
}

async function tryToJoinNewStateChannel(newState) {
  if (guildConnection(newState.guild)) return;
  if (!newState.channel.joinable) return;
  if (newState.channel.type !== "voice") return;
  await newState.channel.join();
}

function guildConnection(guild) {
  return client.voice.connections.find(
    (connection) => connection.channel.guild.id === guild.id
  );
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

client.on("speech", (message) => {
  if (!message.content) return;
  for (const speechCommand of speech) {
    const validSpeechData = speechCommand.speechData.find((ls) =>
      containsEachString(message.content, ls)
    );
    if (validSpeechData) {
      playResource(message.channel, speechCommand.playResource);
      return;
    }
  }
});

function playResource(channel, resource) {
  const fileRegex = /\.(mp3|mp4)$/;
  const connection = client.voice.connections.find(
    (connection) => connection.channel.id === channel.id
  );
  if (fileRegex.test(resource)) {
    connection.play(resource);
  } else {
    connection.play(ytdl(resource));
  }
}

function containsEachString(s, ls) {
  s = s.toLowerCase();
  return ls.reduce(
    (previous, current) => previous && s.includes(current.toLowerCase()),
    true
  );
}

client.once("ready", () => console.log("bot has started"));

client.login(token);
