import fetch from "node-fetch";
import {writeFile} from "node:fs/promises";
import {setTimeout as wait} from "node:timers/promises";

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

export async function downloadAttachments(attachments, path) {
    for (const attachment of attachments) {
        console.log(`Fetching ${attachment.url}`);
        const res = await fetch(attachment.url);
        await writeFile(`${path}/${attachment.id}_${attachment.filename}`, Buffer.from(await res.arrayBuffer()));
    }
}