// content/utils/index.ts

import { IMessage } from "@/types";

export function shouldAIReply(message: IMessage): boolean {
    if (!message) return false;

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
    const messageText = message.texts && message.texts.length > 0
        ? message.texts[0].msg
        : '';

    // Check if this is a reply
    if (message.quotes && message.quotes.length > 0) {
        const lastQuote = message.quotes[message.quotes.length - 1];
        const replyingToName = lastQuote.from.name;
        return `**Replying to ${replyingToName}:** ${messageText}`;
    }

    return messageText;
}