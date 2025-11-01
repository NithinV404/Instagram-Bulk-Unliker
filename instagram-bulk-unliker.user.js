// ==UserScript==
// @name         Instagram Bulk Unliker (v4.9.5 - The Definitive Version)
// @namespace    http://tampermonkey.net/
// @version      4.9.5
// @description  The definitive Unliker. Uses the most robust checks for all UI states, including waiting for post images to load.
// @author       Marco (and AI Assistant)
// @match        https://www.instagram.com/your_activity/interactions/likes/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const CONFIG = {
        UNLIKE_BATCH_SIZE: 50,
        SCROLL_ATTEMPTS: 5,
        DELAY_BETWEEN_SCROLLS_MS: 1200,
        DELAY_BETWEEN_CHECKBOX_CLICKS_MS: 50,
        PAGE_LOAD_TIMEOUT: 30000,
    };
    
    const STATE_KEY = 'instaUnlikeBotState';
    let statusElement;

    // === UI & STYLING (Unchanged) ===
    function createControlPanel() { GM_addStyle(` #unliker-panel { position: fixed; bottom: 20px; right: 20px; background-color: #1e1e1e; border: 1px solid #444; border-radius: 10px; padding: 15px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #fff; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 250px; text-align: center; } #unliker-panel h3 { margin: 0 0 10px; font-size: 16px; border-bottom: 1px solid #444; padding-bottom: 8px; } #unliker-panel button { width: 100%; padding: 8px; border-radius: 5px; border: none; font-size: 14px; font-weight: bold; cursor: pointer; margin-top: 5px; } #unliker-panel button:disabled { cursor: not-allowed; opacity: 0.5; } #unliker-start-btn { background-color: #28a745; color: white; } #unliker-stop-btn { background-color: #dc3545; color: white; } #unliker-status { margin-top: 12px; font-size: 12px; color: #ccc; min-height: 14px; } `); const panel = document.createElement('div'); panel.id = 'unliker-panel'; panel.innerHTML = `<h3>IG Unlike Bot v4.9.5</h3><button id="unliker-start-btn">Start Unliking</button><button id="unliker-stop-btn">Stop</button><div id="unliker-status">Status: Idle</div>`; document.body.appendChild(panel); const startBtn = document.getElementById('unliker-start-btn'); const stopBtn = document.getElementById('unliker-stop-btn'); statusElement = document.getElementById('unliker-status'); startBtn.addEventListener('click', async () => { await GM_setValue(STATE_KEY, 'RUNNING'); updateStatus('Starting... Page will reload.'); await delay(1000); location.reload(); }); stopBtn.addEventListener('click', async () => { await GM_setValue(STATE_KEY, 'IDLE'); updateStatus('Stopping... Page will reload.'); await delay(1000); location.reload(); }); }
    function updateStatus(message, isError = false) { if (statusElement) { statusElement.textContent = `Status: ${message}`; statusElement.style.color = isError ? '#ff6b6b' : '#ccc'; } console.log(`[Bot Status] ${message}`); }
    function updateButtonState(state) { const startBtn = document.getElementById('unliker-start-btn'); const stopBtn = document.getElementById('unliker-stop-btn'); if (startBtn && stopBtn) { startBtn.disabled = (state === 'RUNNING'); stopBtn.disabled = (state !== 'RUNNING'); } }

    // === UTILITY FUNCTIONS ===
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clickElement = async (element) => { if (!element) return; element.scrollIntoView({ behavior: 'smooth', block: 'center' }); await delay(200); element.click(); await delay(300); };
    const waitForElementBySelector = async (selector, timeout = CONFIG.PAGE_LOAD_TIMEOUT) => { const startTime = Date.now(); while (Date.now() - startTime < timeout) { const element = document.querySelector(selector); if (element) return element; await delay(500); } return null; };
    const waitForElementByText = async (textArray, elementType = '*', timeout = CONFIG.PAGE_LOAD_TIMEOUT) => { const startTime = Date.now(); while (Date.now() - startTime < timeout) { for (const text of textArray) { const element = Array.from(document.querySelectorAll(elementType)).find(el => el.textContent.trim() === text); if (element) return element; } await delay(500); } return null; };

    // === CORE BOT LOGIC ===
    const mainContentSelector = 'div[data-bloks-name="bk.components.Collection"]';
    const emptyStateSelector = '[data-testid="generic_container_empty_state"]';
    const postImageSelector = `${mainContentSelector} img[alt]`; // An image inside the collection container

    async function applySortFilterOldest() {
        updateStatus('Waiting for "Sort & Filter" button...');
        const sortFilterButton = await waitForElementBySelector('[role="button"][aria-label="Sort & Filter"]');
        if (!sortFilterButton) throw new Error('Could not find "Sort & Filter" button.');
        
        updateStatus('Opening filter dialog...');
        await clickElement(sortFilterButton);

        updateStatus('Waiting for dialog to appear...');
        const dialog = await waitForElementBySelector('div[role="dialog"]', 10000);
        if (!dialog) throw new Error('Filter dialog did not open.');

        const oldestButton = await waitForElementBySelector('[role="button"][aria-label="Oldest to Newest"]');
        if (!oldestButton) throw new Error('Could not find "Oldest to Newest" option.');
        
        updateStatus('Selecting "Oldest to Newest"...');
        await clickElement(oldestButton);
        await delay(500);

        updateStatus('Waiting for "Apply" button to enable...');
        const applyButton = await waitForElementBySelector('[role="button"][aria-label="Apply"]:not([disabled])');
        if (!applyButton) throw new Error('Could not find enabled "Apply" button.');

        updateStatus('Applying filter...');
        await clickElement(applyButton);

        // ** THE FINAL, PERFECTED CONTENT WAIT **
        updateStatus('Waiting for content to refresh...');
        const startTime = Date.now();
        while (Date.now() - startTime < 15000) {
            const hasPostImages = document.querySelector(postImageSelector);
            const isEmpty = document.querySelector(emptyStateSelector);
            if (hasPostImages && !isEmpty) { // If there are images AND the empty message is gone
                 console.log("New content (post images) loaded successfully.");
                 await delay(500); // Give it a final moment to settle
                 return;
            }
            if (isEmpty) { // If it reloads and is immediately empty, we are done
                 console.log("Content reloaded to an empty state.");
                 return;
            }
            await delay(500);
        }
        console.warn("Content refresh took a while, but continuing...");
    }

    async function processOneBatchAndReload() {
        if (document.querySelector(emptyStateSelector)) {
            updateStatus('Mission Complete! (Empty page)', false);
            await GM_setValue(STATE_KEY, 'IDLE'); updateButtonState('IDLE');
            console.log('🎉 MISSION COMPLETE! Page shows "You haven\'t liked anything".'); return;
        }
        
        updateStatus('Waiting for "Select" button...');
        const selectButtonSpan = await waitForElementByText(['Select'], 'span', 10000);
        if (!selectButtonSpan) {
            updateStatus('Mission Complete! (No Select button)', false);
            await GM_setValue(STATE_KEY, 'IDLE'); updateButtonState('IDLE');
            console.log('🎉 MISSION COMPLETE! No "Select" button found.'); return;
        }
        await clickElement(selectButtonSpan.parentElement);
        await delay(500);

        updateStatus('Scrolling to load posts...');
        if (document.querySelector(mainContentSelector)) { for (let i = 0; i < CONFIG.SCROLL_ATTEMPTS; i++) { document.querySelector(mainContentSelector).scrollBy(0, document.querySelector(mainContentSelector).scrollHeight); await delay(CONFIG.DELAY_BETWEEN_SCROLLS_MS); } }

        const checkboxes = document.querySelectorAll('[aria-label="Toggle checkbox"]');
        if (checkboxes.length === 0) {
            updateStatus('Mission Complete! (No checkboxes)', false);
            await GM_setValue(STATE_KEY, 'IDLE'); updateButtonState('IDLE');
            console.log('🎉 MISSION COMPLETE! No checkboxes found to select.'); return;
        }

        const countToSelect = Math.min(CONFIG.UNLIKE_BATCH_SIZE, checkboxes.length);
        for (let i = 0; i < countToSelect; i++) { updateStatus(`Selecting post ${i + 1}/${countToSelect}...`); if (checkboxes[i]) { checkboxes[i].click(); await delay(CONFIG.DELAY_BETWEEN_CHECKBOX_CLICKS_MS); } }
        
        updateStatus('Finding main "Unlike" button...');
        const redUnlikeSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Unlike') && s.style.color === 'rgb(237, 73, 86)');
        if (!redUnlikeSpan) throw new Error(`Could not find main red "Unlike" button.`);
        await clickElement(redUnlikeSpan.closest('[role="button"]'));
        
        updateStatus('Confirming "Unlike" in dialog...');
        const finalUnlikeSelector = 'div._a9-v button:has(div._aac-)';
        const confirmButton = await waitForElementBySelector(finalUnlikeSelector, 7000);

        if (confirmButton) { await clickElement(confirmButton); }
        else { throw new Error('Could not find final "Unlike" button in dialog.'); }

        updateStatus(`Batch unliked. Page will now reload.`);
        await delay(3000);
        location.reload();
    }

    async function main() {
        createControlPanel();
        const state = await GM_getValue(STATE_KEY, 'IDLE');
        updateButtonState(state);

        if (state !== 'RUNNING') { updateStatus('Idle. Press Start to begin.'); return; }

        try {
            await waitForElementBySelector(mainContentSelector, 15000);
            await applySortFilterOldest();
            await processOneBatchAndReload();
        } catch (error) {
            updateStatus(`${error.message}`, true);
            console.error('An unrecoverable error occurred:', error);
            await GM_setValue(STATE_KEY, 'IDLE');
            updateButtonState('IDLE');
        }
    }

    main();
})();
