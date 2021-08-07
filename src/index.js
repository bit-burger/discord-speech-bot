const { Client } = require("discord.js");
const { DiscordSR } = require("discord-speech-recognition");
const ytdl = require("ytdl-core");

// DiscordSR adds the text-to-speech functionality
const client = new Client();
new DiscordSR(client);

// loadConfig.js loads and validates the speech-config.json
const { token, speech, logging } = require("./loadConfig");

// Goes in channel if at least one real bot person is in there.
// Only leaves the channel if no real person is left
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

// Will check each child of 'speech' for its speechData.
// The speechData contains an array of arrays with words in it.
// If each word of one of the subarrays is found in the transcript,
// the first valid child's playResource is then taken and played.
// Will also check the logging configuration to log at the correct time
client.on("speech", (speechMessage) => {
  if (logging === "all") {
    console.log(speechMessage ?? "[EMPTY BUFFER]");
  }
  if (!speechMessage.content) return;
  if (logging === "allWithoutEmpty") {
    console.log(speechMessage);
  }
  for (const speechCommand of speech) {
    const validSpeechData = speechCommand.speechData.find((ls) =>
      containsEachString(speechMessage.content, ls)
    );
    if (validSpeechData) {
      playResource(speechMessage.channel, speechCommand.playResource);
      if (logging === "onlyValidCommands") {
        console.log(speechMessage);
      }
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
