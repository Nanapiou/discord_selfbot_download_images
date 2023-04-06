# Self bot
## Attachments downloader

This is a self bot that downloads all attachments from a channel and saves them to a folder.

### How to use

1. Download the LTS release of NodeJS from [here](https://nodejs.org/en/download/).
2. Clone this repository using `git clone https://github.com/Nanapiou/discord_selfbot_download_images.git` in a command prompt.
3. Start the `install.bat` file, so that all dependencies are installed.
4. You can now use the `start.bat` file to start the bot. The configuration will be done by launching it.
5. You can now start the bot again after editing the `config.toml` file to your liking (edit it with a notepad for example).

### Possible errors not related to the bot

- `Error: Cannot find module 'pioucord'` - You didn't install the dependencies.
- `Error: AuthenticationFailed` - The token expired. You need to empty the line containing the token in the `src/tokens.txt` file and restart the bot.