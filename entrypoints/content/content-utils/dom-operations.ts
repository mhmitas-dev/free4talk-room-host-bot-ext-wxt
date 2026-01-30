// content/dom-operations.ts
export async function postMessageToUi(text: string): Promise<void> {
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