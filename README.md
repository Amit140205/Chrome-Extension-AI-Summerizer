# 🤖 AI Summary for Articles

> A Chrome Extension that instantly summarizes any article or webpage using Google Gemini 2.5 Flash AI.

---

## 📸 Overview

Open any article, click the extension icon, choose your summary style, and get an AI-generated summary in seconds — without leaving the page.

---

## ✨ Features

- **3 Summary Modes** — Brief (2-3 sentences), Detailed, or Bullet Points
- **Gemini 2.5 Flash** — Fast, accurate AI summaries powered by Google's Gemini API
- **Works on Any Page** — Extracts text from `<article>` tags or all `<p>` paragraphs as fallback
- **Copy to Clipboard** — One-click copy of the generated summary
- **Secure API Key Storage** — Your Gemini API key is stored locally via `chrome.storage.sync`
- **Auto-setup on Install** — Opens the settings page automatically if no API key is found

---

## 📁 Project Structure

```
ai-summary-extension/
├── manifest.json       # Chrome Extension config (Manifest V3)
├── background.js       # Service worker — handles install event
├── content.js          # Injected into pages — extracts article text
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic — calls Gemini API, renders summary
├── options.html        # Settings page UI
├── options.js          # Saves/loads Gemini API key
└── icon.png            # Extension icon
```

---

## ⚙️ How It Works

```
User clicks extension icon
        ↓
Popup opens → reads Gemini API key from chrome.storage.sync
        ↓
User selects summary type and clicks "Summarize"
        ↓
popup.js messages content.js → "GET_ARTICLE_TEXT"
        ↓
content.js extracts text from <article> or <p> tags
        ↓
Text sent to Gemini 2.5 Flash API with selected prompt
        ↓
Summary displayed in popup (copyable)
```

---

## 🚀 Installation

### 1. Get a Gemini API Key

Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and create a free API key.

### 2. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the project folder

### 3. Set Your API Key

The options page will open automatically on first install. Enter your Gemini API key and click **Save Settings**.

You can also access settings anytime by right-clicking the extension icon → **Options**.

---

## 🧠 Summary Modes

| Mode | Description |
|---|---|
| **Brief** | 2-3 sentence high-level summary |
| **Detailed** | Comprehensive summary of the full article |
| **Bullet Points** | 5-7 key takeaways, each starting with `-` |

---

## 🔑 Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Access the currently open tab to extract text |
| `scripting` | Inject and communicate with `content.js` |
| `storage` | Save the Gemini API key locally |
| `host_permissions: <all_urls>` | Allow text extraction on any website |

---

## 📄 Key Files Explained

### `manifest.json`
Defines the extension using Manifest V3. Registers `content.js` as a content script injected on all URLs, sets `background.js` as a service worker, and points to `popup.html` as the default action popup.

### `background.js`
Runs on extension install. Checks `chrome.storage.sync` for a saved API key — if none exists, automatically opens `options.html` so the user can set one.

### `content.js`
Injected into every page. Listens for the `GET_ARTICLE_TEXT` message from the popup. Tries to extract text from the `<article>` element first; falls back to joining all `<p>` tag contents.

### `popup.js`
Handles the full summarization flow — retrieves the API key, messages `content.js` for page text, truncates text to 20,000 characters, builds the prompt based on selected mode, calls the Gemini API, and renders the result. Also handles the copy-to-clipboard button.

### `options.js`
Loads any existing API key into the input field on page load. On save, stores the key in `chrome.storage.sync` and closes the options window after 1 second.

---

## 🔧 Gemini API Details

- **Model:** `gemini-2.5-flash`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Temperature:** `0.2` (low, for consistent factual summaries)
- **Max input:** 20,000 characters (text is truncated beyond this)

---

## 🛠️ Development

No build step required — this is a plain HTML/CSS/JS extension.

To make changes:
1. Edit any file
2. Go to `chrome://extensions/`
3. Click the **refresh icon** on the extension card
4. Re-open the popup to see your changes

---

