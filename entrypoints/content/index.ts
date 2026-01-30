// content/index.ts
import { IMessage } from "@/types";
import { formatMessage, shouldAIReply } from "./content-utils";
import { handleMessage } from "./content-utils/handle-message";

interface MessageStore {
  ver: string | number;
  data: IMessage[];
}

export default defineContentScript({
  matches: ['https://www.free4talk.com/*'],
  main() {
    // Only start if we're in a room
    if (window.location.pathname.startsWith('/room/')) {
      startAutoReplyBot();
    }
  },
});

function startAutoReplyBot(): void {
  let currentRoomId: string | null = null;
  let initialVer: string | number | null = null;
  const msgHistory: Set<string> = new Set();

  console.log(`🤖 Auto-Reply Bot started at ${new Date().toLocaleTimeString()}`);

  const loop = (): void => {
    // Detect room changes (to reset state)
    const roomId = getRoomIdFromUrl();
    if (roomId !== currentRoomId) {
      console.log(`🔄 Room changed: ${currentRoomId} → ${roomId}`);
      currentRoomId = roomId;
      msgHistory.clear();
      initialVer = null;
      return;
    }

    const store = extractMessages();
    if (!store) return;

    const { ver, data = [] } = store;

    // Initialize version tracking
    if (!initialVer) {
      initialVer = ver;
      console.log(`📝 Monitoring room with ${data.length} existing messages`);
      return;
    }

    // Skip if no new messages
    if (ver === initialVer) return;

    initialVer = ver;

    const lastMsg = data[data.length - 1];
    if (!lastMsg?.id) return;

    // Process only new messages
    if (!msgHistory.has(lastMsg.id)) {
      msgHistory.add(lastMsg.id);
      processNewMessage(lastMsg);
    }
  };

  function processNewMessage(msg: IMessage): void {
    // Apply filters
    if (!shouldAIReply(msg)) return;

    const username = msg.from?.name || msg.from?.id || "Unknown";
    const message = formatMessage(msg);

    console.log(`💬 [${username}]: "${message.slice(0, 100)}${message.length > 100 ? '...' : ''}"`);

    // Send to AI handler
    handleMessage({
      message,
      username,
      groupId: msg.rid
    });
  }

  // Start the loop (check every 500ms)
  setInterval(loop, 500);
}

function extractMessages(): MessageStore | null {
  const raw = localStorage.getItem('free4talk:messages');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MessageStore;
  } catch (err) {
    console.error('Failed to parse messages:', err);
    return null;
  }
}

function getRoomIdFromUrl(): string | null {
  const match = window.location.pathname.match(/^\/room\/([^/?]+)/);
  return match ? match[1] : null;
}