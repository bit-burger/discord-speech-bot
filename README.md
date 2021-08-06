# discord-speech-bot
Discord speech bot, with configurable commands

## Setup
- clone the repository or download it and save it somewhere
- [download nodejs](https://nodejs.org/en/download/) (if you haven't already) and run `npm i` in the project folder
- in the project folder, write a new file called speech-config.json
- copy paste the defaults below into the file and replace the '[DISCORD BOT TOKEN]' with your discord bot token from [discord developers](https://discord.com/developers)
```json
{
  "speech": [
    {
      "speechData": [["rick", "roll"]],
      "playResource": "https://www.youtube.com/watch?v=ub82Xb1C8os"
    }
  ],
  "token": "[DISCORD BOT TOKEN]"
}
```

## Run the bot
- for basic running or locally testing just use run `npm start` in the project folder
- for running it longer you can host it on [heroku](https://www.heroku.com) or use [pm2](https://pm2.keymetrics.io)

## Further configuration
- customize the logging, by setting the logging property to 'all', 'allWithoutEmpty', 'onlyValidCommands' or 'none', by default it is allWithoutEmpty
- add new speech commands to the speech array. Each speech command needs the speechData, which consists of different word groups that can activate the command and the play resource, which can either be a youtube link or a path to either a mp3 or mp4
### Example of a more complicated configuration might be: 
```json
{
  "speech": [
    {
      "speechData": [["rick", "roll"]],
      "playResource": "https://www.youtube.com/watch?v=ub82Xb1C8os"
    },
    {
      "speechData": [["air", "horn"], ["MLG"], ["alarm"]],
      "playResource": "./mlg-airhorn.mp3" 
    }
  ],
  "token": "[DISCORD BOT TOKEN]",
  "logging": "none"
}
```
*Note: mlg-airhorn.mp3 would be located inside of the project folder*
