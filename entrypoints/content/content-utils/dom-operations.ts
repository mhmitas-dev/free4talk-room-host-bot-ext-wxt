// content/dom-operations.ts
export async function postMessageToUi(text: string): Promise<void> {
    sendMessageWithTypingDelay(text);
    // sendMessage(text);
}

async function sendMessage(text: string) {
    const textarea = document.querySelector('textarea');

    if (!textarea) {
        console.error('Could not find textarea');
        return;
    }

    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 100));

    const sendButton = document.querySelector(
        '.input-send-box button[type="button"]'
    ) as HTMLButtonElement | null;

    if (!sendButton) {
        console.error('Could not find send button');
        return;
    }

    sendButton.click();
}

function sendMessageWithTypingDelay(text: string) {
    const MS_PER_CHAR = 30;          // fast human / AI typing
    const MAX_DELAY_MS = 10_000;     // hard cap: 10 seconds
    const MIN_DELAY_MS = 300;        // avoid instant replies

    // Base typing time
    let typingTimeMs = text.length * MS_PER_CHAR;

    // Add small human-like randomness (±15%)
    const jitter = typingTimeMs * (0.85 + Math.random() * 0.3);
    typingTimeMs = jitter;

    // Enforce bounds
    typingTimeMs = Math.min(
        Math.max(typingTimeMs, MIN_DELAY_MS),
        MAX_DELAY_MS
    );
    console.log("Typing...")
    setTimeout(() => {
        sendMessage(text?.trim());
        console.log(`Typing delay: ${(typingTimeMs / 1000).toFixed(2)}s`);
        console.log(`🤖: ${text}`)
    }, typingTimeMs);
}