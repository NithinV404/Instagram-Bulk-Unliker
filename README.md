<br>
<p align="center">
  <!-- THE FIX IS HERE: Using a reliable PNG link instead of a raw SVG -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Icon" width="80">
  <h1 align="center">Instagram Bulk Unliker</h1>
  <p align="center">
    A robust and user-friendly Tampermonkey script to bulk unlike Instagram posts. It features a simple UI, intelligent automation, and a self-reloading mechanism for maximum stability.
    <br />
    <br />
    <a href="https://github.com/NithinV404/Instagram-Bulk-Unliker/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT">
    </a>
    <a href="https://github.com/NithinV404/Instagram-Bulk-Unliker">
      <img src="https://img.shields.io/badge/Version-4.9.5-blue.svg?style=for-the-badge" alt="Version">
    </a>
  </p>
</p>

---

This script provides a safe and reliable way to clean up your "Liked" posts on Instagram directly from your browser. It's designed to mimic human behavior by being patient and reloading the page to prevent errors, ensuring a smooth and complete cleanup of your activity.


> **Note:** It is highly recommended to create a short screen recording (GIF) of the script in action and add it here. This provides the best user experience. You can use free tools like [ScreenToGif](https://www.screentogif.com/) (Windows) or [Kap](https://getkap.co/) (macOS).

## 🌟 Key Features

- **✅ Simple UI Panel:** An on-screen control panel with **Start** and **Stop** buttons. No need to edit code to use the script.
- **🔄 Auto-Reload Loop:** After unliking a batch of posts, the script automatically reloads the page. This is the most crucial feature, preventing failures when Instagram's interface freezes after a bulk action.
- **🧠 Smart & Patient:** Instead of using fixed delays that can fail on slow connections, the script proactively waits for UI elements to appear, disappear, or become enabled before taking action.
- **🕰️ Sorts by Oldest:** Automatically applies the "Oldest to newest" filter on every run, allowing you to clean up your history from the very beginning.
- **🔒 Safe & Secure:**
    - **Limited Scope:** Runs **only** on the `instagram.com/your_activity/interactions/likes/` page.
    - **No Data Transmission:** The script does not request network permissions and does not send any of your data to external servers. All operations are performed locally in your browser.
- **🏁 Automatic Completion:** The script intelligently detects when all posts have been unliked (by seeing the "You haven't liked anything" message) and stops automatically.

---

## 🛠️ Installation Guide

Follow these two simple steps to get the script running.

### Step 1: Install a Userscript Manager

You need a browser extension to manage userscripts. If you don't have one, **[Tampermonkey](https://www.tampermonkey.net/)** is the recommended choice.

- **[Install for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)**
- **[Install for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)**
- **[Install for Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)**
- **[Install for Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)**

### Step 2: Install the Instagram Bulk Unliker Script

With Tampermonkey installed, simply click the link below. Tampermonkey will open a new tab and ask you to confirm the installation.

> **➡️ [Click Here to Install the Script](https://raw.githubusercontent.com/NithinV404/Instagram-Bulk-Unliker/main/instagram-bulk-unliker.user.js)**

After clicking "Install" in the Tampermonkey tab, the script is ready to use!

---

## 🚀 How to Use the Script

1.  After installation, navigate to your "Likes" activity page on Instagram:
    ```
    https://www.instagram.com/your_activity/interactions/likes/
    ```
2.  The **"IG Unlike Bot"** control panel will appear in the bottom-right corner.
3.  Click the green **Start Unliking** button.
4.  The page will reload, and the script will begin its automated cycle:
    - It will apply the "Oldest to newest" filter.
    - It will select a batch of posts.
    - It will unlike them and confirm the action.
    - It will reload the page to start the next cycle. This is normal and expected.
5.  Let the script run. It will continue this loop until it sees the "You haven't liked anything" message, at which point it will stop automatically.
6.  To stop the process manually at any time, simply click the red **Stop** button. The script will not start again on the next reload.

---

## ⚠️ Troubleshooting

**Problem:** The script immediately stops with an error like `"Could not find 'Sort & Filter' button"` or the page doesn't load correctly.

**Solution:** This is almost always caused by an **ad blocker** or privacy extension (e.g., uBlock Origin, AdBlock Plus). These extensions can block essential parts of Instagram's page from loading, which prevents the script from finding the buttons it needs.

- **You must whitelist `instagram.com` in your ad blocker.**
  1.  Go to the Instagram page.
  2.  Click your ad blocker's icon in the browser toolbar.
  3.  Find the main power button or a switch to **disable it for the current site**.
  4.  Reload the page. The script should now work correctly.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
