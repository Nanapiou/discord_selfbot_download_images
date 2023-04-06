import {fetchAllMessages, getAttachments, downloadAttachments} from "../util/functions.js";

export default {
    name: "history",
    async run(client, message, args) {
        const channels = client.imageChannel;
        if (!args[0]) return client.rest.post(`/channels/${message.channel_id}/messages`, {
            content: `You need to specify a message id.\nUsage: \`${client.config.prefix}history 1234\`\nChose between these:\n>>> ${Array.from(channels.values()).map(c => `${c.id} (${c.name}, <#${c.id}>)`).join("\n")}`,
            message_reference: {
                message_id: message.id,
            }
        });
        const channelId = args[0];
        if (!channels.has(channelId)) return client.rest.post(`/channels/${message.channel_id}/messages`, {
            content: `Channel not found.\nChose between these:\n>>> ${Array.from(channels.values()).map(c => `${c.id} (${c.name}, <#${c.id}>)`).join("\n")}`,
            message_reference: {
                message_id: message.id,
            }
        });
        const path = client.config.channels[channelId];
        client.rest.post(`/channels/${message.channel_id}/messages`, {
            content: `Scanning channel <#${channelId}>...`,
            message_reference: {
                message_id: message.id,
            }
        });
        const messages = await fetchAllMessages(client, channelId);
        const attachments = getAttachments(messages);
        client.rest.post(`/channels/${message.channel_id}/messages`, {
            content: `Found ${attachments.length} attachments, downloading...`,
        });
        await downloadAttachments(attachments, path);
        return client.rest.post(`/channels/${message.channel_id}/messages`, {
            content: `Scanned and downloaded ${attachments.length} attachments from <#${channelId}>`,
            message_reference: {
                message_id: message.id
            }
        });
    }
}