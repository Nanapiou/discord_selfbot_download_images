import {existsSync} from 'node:fs';

export default async function (client) {
    console.log(`Logged in as ${client.user.username}. Press CTRL+C to exit`);

    client.imageChannel = new Map();
    for (const channelId of Object.keys(client.config.channels)) {
        if (!existsSync(client.config.channels[channelId])) {
            console.log(`Channel ${channelId} has not a valid path, ignoring it`);
            continue;
        }
        const channel = await client.rest.get(`/channels/${channelId}`).catch(() => null);
        if (!channel) {
            console.log(`Channel ${channelId} not found, ignoring it`);
            continue;
        }
        client.imageChannel.set(channelId, channel);
        console.log(`Listening events for channel ${channel.name}`);
        client.addGuildEvents(channel.guild_id);
    }
}