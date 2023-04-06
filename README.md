# Self bot
## Attachments downloader

This is a self bot that downloads all attachments from a channel and saves them to a folder.

### How to start

1. Download the LTS release of NodeJS from [here](https://nodejs.org/en/download/).
2. Clone this repository using `git clone https://github.com/Nanapiou/discord_selfbot_download_images.git` in a command prompt.
3. Start the `install.bat` file, so that all dependencies are installed.
4. You can now use the `start.bat` file to start the bot. The configuration will be done by launching it.
5. You can now start the bot again after editing the `config.toml` file to your liking (edit it with a notepad for example).

### Usage

All the channels provided in the `config.toml` file will be scanned for attachments. When a new message is sent, the bot will download all the attachments and save them in the specified path.

You can also use the `!history` (maybe you changed the prefix) command to download all the old attachments from a channel.
*The bot will not answer if it is not in the guild specified in the config file, and from the specified user*

### Possible errors not related to the bot

- `Error: Cannot find module 'pioucord'` - You didn't install the dependencies.
- `Error: AuthenticationFailed` - The token expired. You need to empty the line containing the token in the `src/tokens.txt` file and restart the bot.