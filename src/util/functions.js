import fetch from "node-fetch";
import {writeFile} from "node:fs/promises";

export function getToken(login, password) {
    return fetch("https://discord.com/api/v9/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
        },
        body: JSON.stringify({
            login,
            password,
            captcha_key: null,
            gift_code_sku_id: null,
            login_source: null,
            undelete: false,
        })
    }).then(res => res.json());
}

export async function fetchAllMessages(client, channelId) {
    const messages = [];
    let lastMessages = await client.rest.get(`/channels/${channelId}/messages?limit=100`);
    messages.push(...lastMessages);
    while (lastMessages.length === 100) {
        lastMessages = await client.rest.get(`/channels/${channelId}/messages?limit=100&before=${lastMessages[lastMessages.length - 1].id}`);
        messages.push(...lastMessages);
    }
    return messages;
}

export function getAttachments(messages) {
    const attachments = [];
    for (const message of messages) {
        attachments.push(...message.attachments);
    }
    return attachments;
}

export function getEmbeds(messages) {
    const embeds = [];
    for (const message of messages) {
        for (const embed of message.embeds) {
            if (embed.type === "image" || embed.type === "gifv" || embed.type === "video") {
                embeds.push(embed);
            }
        }
    }
    return embeds;
}

function cleanName(name, max=256) {
    const cleaned = name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '').replaceAll('..', '.');
    return cleaned.length > max ? cleaned.slice(cleaned.length - max) : cleaned;
}

export async function downloadAttachments(attachments, path, n=10) { // Download n per n attachments
    const promises = [];
    for (let i = 0; i < attachments.length; i += n) {
        const attachmentsToDownload = attachments.slice(i, i + n);
        for (const attachment of attachmentsToDownload) {
            console.log(`Fetching ${attachment.url}`);
            const promise = fetch(attachment.url).then(res => res.arrayBuffer()).then(buffer => writeFile(`${path}/${attachment.id}_${cleanName(attachment.filename, 235)}`, Buffer.from(buffer)));
            promises.push(promise);
        }
        console.log(`Waiting for ${attachmentsToDownload.length} attachments to be downloaded`);
        await Promise.all(promises);
    }
}

export async function downloadEmbeds(embeds, path, n=10) { // Download n per n embeds
    const promises = [];
    for (let i = 0; i < embeds.length; i += n) {
        const embedsToDownload = embeds.slice(i, i + n);
        for (const embed of embedsToDownload) {
            console.log(`Fetching ${embed.url}`);
            const promise = fetch(embed.url).then(res => res.arrayBuffer()).then(buffer => writeFile(`${path}/${cleanName(embed.url)}`, Buffer.from(buffer)));
            promises.push(promise);
        }
        console.log(`Waiting for ${embedsToDownload.length} embeds to be downloaded`);
        await Promise.all(promises);
    }
}

export function checkConfig(config) {
    if (!config.user_id) {
        throw new Error("Missing user_id in config.json");
    }
    if (!config.guild_id) {
        throw new Error("Missing guild_id in config.json");
    }
    if (!config.channels || Object.keys(config.channels).length === 0) {
        throw new Error("Missing channels in config.json");
    }
    if (!config.prefix) {
        throw new Error("Missing prefix in config.json");
    }
    if (!config.account) {
        throw new Error("Missing account in config.json");
    }
    if (!config.download_rate) config.download_rate = 25;
}