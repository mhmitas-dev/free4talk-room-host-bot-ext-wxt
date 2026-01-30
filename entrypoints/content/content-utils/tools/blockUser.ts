export async function blockUser({ username }: { username: string }): Promise<string> {
    // Validate input
    if (typeof username !== 'string' || !username.trim()) {
        return 'Invalid username: must be a non-empty string';
    }

    const cleanedUsername = username.trim();
    let openedDropdown = false;
    let openedPopover = false;

    try {
        // Step 1: Locate user card and click settings button
        const nameEl = Array.from(document.querySelectorAll('.name.notranslate > div'))
            .find(el => el.textContent.trim() === cleanedUsername);

        if (!nameEl) {
            throw new Error(`User not found: "${cleanedUsername}"`);
        }

        const card = nameEl.closest('.sc-emmjRN');          // ← updated selector
        if (!card) {
            console.error("Card not found for:", cleanedUsername);
            throw new Error('Something went wrong, block function is not working!');
        }

        const settingsBtn = card.querySelector<HTMLButtonElement>('button.setting');
        if (!settingsBtn) {
            throw new Error(`Cannot block "${cleanedUsername}": insufficient permissions or user is yourself`);
        }

        // Clean up any existing open menus
        if (document.querySelector('.ant-dropdown, .ant-popover')) {
            document.body.click();
            await new Promise(r => setTimeout(r, 100));
        }

        settingsBtn.click();
        openedDropdown = true;

        // Step 2: Wait for dropdown and click Block
        await new Promise(r => setTimeout(r, 150));
        const blockBtn = Array.from(document.querySelectorAll('ul.ant-dropdown-menu button.ant-btn-sm'))
            .find((b): b is HTMLButtonElement => b.textContent?.includes('Block') ?? false);

        if (!blockBtn) {
            console.error(`Block button not found for "${cleanedUsername}"`);
            openedDropdown = false;
            throw new Error('Something went wrong, block function is not working!');
        }

        blockBtn.click();
        openedPopover = true;

        // Step 3: Wait for confirmation popover and click OK
        await new Promise(r => setTimeout(r, 150));
        const okBtn = document.querySelector<HTMLButtonElement>('.ant-popover .ant-popover-buttons button.ant-btn-primary');

        if (!okBtn) {
            console.error(`Confirmation dialog not found for blocking "${cleanedUsername}"`);
            throw new Error('Something went wrong, block function is not working!');
        }

        okBtn.click();

        return `Successfully blocked "${cleanedUsername}"`;

    } catch (error) {
        console.error(error);
        // Cleanup on any error
        try {
            if (openedDropdown || openedPopover) {
                document.body.click();
            }
        } catch (e) {
            // Ignore cleanup errors
        }

        return error instanceof Error ? error.message : 'Something went wrong, block function is not working!';
    }
}