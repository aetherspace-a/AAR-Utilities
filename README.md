# ✈️ AAR-Utilities Bot

> *Official Utility Suite for Asiana Airlines PTFS*

---

### 📂 File Structure Overview

Your bot is organized into specialized modules to ensure efficiency and clean code management:

* **`audio/`** ➠ Contains critical assets for `boarding.mp3`, `landing.mp3`, and `safety.mp3`.
* **`commands/`** ➠ Organized into five core functional categories:
* 🛡️ **Admin**: `force-qotd.js`
* ✈️ **Aviation**: `flightrequest.js`, `metar.js`, `notam.js`, `zulu.js`
* 🎉 **Fun**: `a.js`, `goon.js`, `lofi.js`, `mrbeast.js`
* ⚖️ **Moderation**: `kick.js`, `purge.js`
* 🛠️ **Utilities**: `ping.js`, `server-info.js`, `user-profile.js`
* 🔊 **Voice**: `boarding.js`, `landing.js`, `safetyvideo.js`, `stop.js`


* **`events/`** ➠ Handles bot lifecycle events like `ready.js`, `guildMemberAdd.js`, and `interactionCreate.js`.

---

### 🚀 Feature Highlights

| Category | Capability |
| --- | --- |
| **Flight Ops** | Real-time weather (`/metar`), NOTAMs, and UTC time synchronization. |
| **Voice Assets** | On-demand cabin announcements and safety briefings. |
| **Admin Controls** | Force-triggering of the daily QOTD and robust moderation tools. |
| **System Health** | Real-time latency monitoring and server statistics. |

---

### 🛠️ Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/AAR-UTILITIES.git
cd AAR-UTILITIES

```



```
2.  **Install dependencies:**
    ```bash
npm install

```

3. **Configure environment:** Create a `.env` file and input your `DISCORD_TOKEN`.
4. **Launch the bot:**
```bash

```



node index.js

```

---

### ⚙️ Technical Specs
🔹 **Framework:** `discord.js` (v14+)
🔹 **Environment:** `Node.js` (v18+)
🔹 **Voice Engine:** Integrated `@discordjs/voice` support for audio assets.
🔹 **Event Handling:** Modular `events/` system for seamless interaction processing.

---

*Built with precision for Asiana Airlines PTFS.*