# ✈️ AAR-UTILITIES Bot
> *Official Utility Suite for Asiana Airlines PTFS*

---

### 📋 Project Structure
Your bot is organized into specialized modules to ensure efficiency and clean code management:

* **`audio/`** ➠ Contains aviation assets (`boarding.mp3`, `landing.mp3`, `safety.mp3`).
* **`commands/`** ➠ 
    * 🛡️ **Admin**: `force-qotd.js`
    * ✈️ **Aviation**: `flightrequest.js`, `metar.js`, `notam.js`, `zulu.js`
    * 🎉 **Fun**: `a.js`, `goon.js`, `lofi.js`, `mrbeast.js`
    * ⚖️ **Moderation**: `kick.js`, `purge.js`
    * 🛠️ **Utilities**: `ping.js`, `server-info.js`, `user-profile.js`, `rank.js`
    * 🔊 **Voice**: `boarding.js`, `landing.js`, `safetyvideo.js`, `stop.js`
* **`events/`** ➠ Handles bot lifecycle and XP tracking (`leveling.js`, `interactionCreate.js`, etc.).

---

### 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Leveling System** | Full-featured XP tracking with auto-role rewards for levels 10, 20, 30, 40, and 50+. |
| **Aviation Ops** | Real-time weather (`/metar`), NOTAMs, and UTC time synchronization. |
| **Voice Assets** | On-demand cabin announcements and safety briefings. |
| **Admin Controls** | Force-triggering of daily QOTD and robust moderation. |
| **Panel Aesthetics** | High-end embedded panels for all user feedback. |

---

### 📈 Leveling & Reward Roles
The bot automatically tracks progress and assigns roles based on user engagement:
* **Level 10** ➠ `1507304664016748615`
* **Level 20** ➠ `1507304633259921408`
* **Level 30** ➠ `1507304599587917856`
* **Level 40** ➠ `1507304525751521400`
* **Level 50+** ➠ `1507304504465428635`

---

### 🛠️ Setup
1. **Clone & Install:** `git clone ...` then `npm install`
2. **Environment:** Setup `.env` with your `DISCORD_TOKEN`.
3. **Deploy:** `node deploy-commands.js`
4. **Launch:** `node index.js`

---

*Built with precision for Asiana Airlines PTFS.*