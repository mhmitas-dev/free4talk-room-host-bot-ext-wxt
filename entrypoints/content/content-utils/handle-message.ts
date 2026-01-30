// content/handle-message.ts
import { userConfigStorage } from "@/utils/config-storage";
import { postMessageToUi } from "./dom-operations";
import { blockUser } from "./tools/blockUser";

interface AIResponse {
    success: boolean;
    response: string;
    error?: string;
}

interface QueuedMessage {
    message: string;
    username: string;
    groupId: string;
}

const MAX_QUEUE_SIZE = 5;
const messageQueue: QueuedMessage[] = [];
let currentProcessing: Promise<void> | null = null;

export function handleMessage({
    message,
    username,
    groupId
}: {
    message: string;
    username: string;
    groupId: string;
}) {
    // If busy, try to queue
    if (currentProcessing !== null) {
        if (messageQueue.length >= MAX_QUEUE_SIZE) {
            console.log('📛 Queue full, dropping message:', {
                from: username,
                preview: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
                groupId
            });
            return;
        }
        messageQueue.push({ message, username, groupId });
        console.log(`📥 Queued: ${messageQueue.length}/${MAX_QUEUE_SIZE}`);
        return;
    }

    // Start processing immediately
    currentProcessing = processMessage({ message, username, groupId });
}

async function processMessage(queuedMsg: QueuedMessage) {
    try {
        const config = await userConfigStorage.getValue();

        const SERVER_URL = config.serverUrl;
        const CHAT_ENDPOINT = config.chatEndpoint;

        if (!SERVER_URL || !CHAT_ENDPOINT) {
            console.error(`❌ Server URL or chat endpoint hasn't been configured`);
            return;
        }

        const response = await fetch(`${SERVER_URL}/${CHAT_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: queuedMsg.groupId,
                newMessage: {
                    username: queuedMsg.username,
                    text: queuedMsg.message
                }
            }),
        });

        const data: AIResponse = await response.json();

        if (!data?.success || !data?.response) {
            console.log("❌ Something went wrong in the server!\n", data?.error);
            return;
        }

        const reply = data.response.trim();

        // NO REPLY
        if (reply === "__NO_REPLY__") {
            console.log("🚫 AI chose not to reply");
            return;
        }

        // BLOCK USER
        if (reply.startsWith("__BLOCK_USER__:")) {
            const username = reply.slice("__BLOCK_USER__:".length).trim();
            if (username) {
                console.log("⛔ BLOCK USER:", username);
                blockUser({ username });
            }
            return;
        }

        // NORMAL MESSAGE
        console.log(`✅ AI: ${reply}`);
        postMessageToUi(reply);

    } catch (error) {
        console.error('❌ Request failed:', error);
    } finally {
        // Always continue with next if available
        const next = messageQueue.shift();
        if (next) {
            console.log(`📤 Processing next, ${messageQueue.length} remaining`);
            currentProcessing = processMessage(next);
        } else {
            currentProcessing = null;
        }
    }
}