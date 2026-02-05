// content/utils/index.ts

import { IMessage } from "@/types";
import { postMessageToUi } from "./dom-operations";

export function shouldAIReply(message: IMessage): boolean {
    if (!message) return false;

    greetNewParticipant(message);

    // 1. Ignore own messages
    if (message.isMyself) return false;

    // 2. Ignore system/admin
    const senderId = message.from?.id;
    if (senderId === "system" || senderId === "free4talk-admin") {
        return false;
    }

    // 3. Ignore server-side broadcasts
    if (message.isFromServer) return false;

    // 4. Only reply if quoted/mentioned (if there are quotes)
    if (message?.quotes && message.quotes?.length > 0) {
        const lastQuote = message.quotes[message.quotes.length - 1];
        const isForMe = lastQuote.from?.name === "Teddybot";
        if (!isForMe) return false;
    }

    // 5. Ignore updates (Reactions/Likes/Edits)
    if (message.updated) return false;

    // 6. Ensure required fields exist
    const text = message.texts?.[0]?.msg;
    const username = message.from?.name;
    const rid = message.rid;

    if (!text || !username || !rid) return false;

    return true;
}

export function formatMessage(message: IMessage): string {
    const messageText = message?.texts && message.texts?.length > 0
        ? message.texts[0].msg
        : '';
    if (message?.quotes && message?.quotes?.length > 0) {
        const lastQuote = message.quotes[message.quotes.length - 1];
        const replyingToName = lastQuote?.from?.name;

        const truncatedReference = (lastQuote?.msg || "")
            .replace(/\n/g, " ")
            .slice(0, 100)
            .trimEnd() + "...";

        const formattedMessage = `**Name: ${message.from?.name}**\nMessage:\n` +
            `Replying to ${replyingToName}\n` +
            `Reference: "${truncatedReference}"\n` +
            `Content: ${messageText.trim()}`;
        return formattedMessage

    } else {
        return `**Name: ${message.from?.name}**\nMessage: ${messageText}`;
    }

}

export function greetNewParticipant(message: IMessage): void {
    // Check if this is actually a system join event
    const isSystem = message?.from?.id === "system";
    const joinEvent = message?.systems?.find(s => s.kind === "typography:join");

    if (!isSystem || !joinEvent || !joinEvent?.client?.name) {
        return; // Exit quietly if it's not a join message
    }

    const username = joinEvent.client.name;

    const greetings = [
        `Welcome to the room, ${username}!`,
        `Hi ${username}, glad you could join us!`,
        `Hey ${username}! How's it going?`,
        `Hello ${username}! Welcome aboard.`,
        `Nice to see you here, ${username}.`,
        `Welcome, ${username}! Feel free to jump into the conversation.`
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    postMessageToUi(randomGreeting);
}