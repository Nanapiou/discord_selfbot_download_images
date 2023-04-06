import {downloadAttachments, downloadEmbeds} from "../util/functions.js";

export default async function (client, message) {
    if (message.author.id === client.config.account_id || message.guild_id === client.config.guild_id) {
        const {prefix} = client.config;

        if (message.content.startsWith(prefix)) {
            const [commandName, ...args] = message.content.slice(prefix.length).split(/ +/);
            client.commands.get(commandName)?.run(client, message, args);
        }
    }

    if (client.imageChannel.has(message.channel_id)) {
        const path = client.config.channels[message.channel_id];
        await downloadAttachments(message.attachments, path);
        await downloadEmbeds(message.embeds.filter(embed => embed.type === "image" || embed.type === "gifv" || embed.type === "video"), path);
    }
}