# Meeting Room Booking

> Real-time meeting room booking system built with Vanilla HTML/CSS/JS — no build step required

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-English-orange.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow.svg)

## 📸 Screenshots
<!-- Add real screenshots later -->
| Room List | Timeline | Booking Modal |
|:---:|:---:|:---:|
| ![rooms](screenshots/rooms.png) | ![timeline](screenshots/timeline.png) | ![modal](screenshots/modal.png) |

## ✨ Features
- 🏢 **4 Meeting Rooms** — categorized by department, capacity, equipment
- ⏰ **30-min Slots** — 08:00–20:00 booking window
- 🔄 **Real-time Status** — animated flap shows Free/Busy, auto-refreshes every 30s
- 📅 **Date Navigation** — Previous/Next/Today buttons
- ❌ **Cancel Booking** — click × on any booking block
- 💾 **Auto-save** — uses `window.storage` API with localStorage fallback
- 📱 **Responsive** — works on mobile and desktop

## 🛠 Tech Stack
| Category | Details |
|----------|---------|
| **Frontend** | HTML5, CSS3 (CSS Variables), Vanilla ES6+ |
| **Fonts** | Space Grotesk, Inter, IBM Plex Mono (Google Fonts) |
| **Storage** | `window.storage` API + localStorage fallback |
| **Architecture** | Single-file modules, no build step |

## 🚀 Quick Start
```bash
git clone https://github.com/nana14329245/Meeting-Room-Booking.git
cd Meeting-Room-Booking
# Open index.html directly in browser
# Or use a live server (VS Code Live Server, npx serve, etc.)
```
> **No `npm install` or build required**

## 📖 Usage
1. **Select Room** — click a room card on the left (selected room gets a dark border)
2. **Select Date** — use ‹ / › / "Today" on the top bar
3. **Book** — click an empty time slot (white) on the timeline, or click "+ Book This Room"
4. **Fill Details** — meeting title, organizer name, start/end time
5. **Confirm** — click "Confirm Booking"
6. **Cancel** — click × on the booking block you want to remove

## 📁 Project Structure
```
Meeting-Room-Booking/
├── index.html      # Main UI structure (60 lines)
├── script.js       # All logic (325 lines)
│   ├── ROOMS config, time utilities
│   ├── storage (load/save/seed)
│   ├── booking CRUD + conflict detection
│   ├── render: room list, status board, timeline, modal
│   └── event handlers + init
└── style.css       # All styling (238 lines)
    ├── CSS Variables (theme colors)
    ├── Layout: grid, responsive
    ├── Components: cards, flaps, timeline, modal
    └── Animations: flap flip, hover states
```

## ⚙️ Configuration (edit in `script.js`)
```js
const OPEN_HOUR = 8;        // Opening hour (08:00)
const CLOSE_HOUR = 20;      // Closing hour (20:00)
const STORAGE_KEY = 'roombooking:bookings';

const ROOMS = [
  {id:'sky',    name:'Sales Meeting Room',     capacity:10, equip:'Projector · Video Conference'},
  {id:'harbor', name:'HR Meeting Room',        capacity:6,  equip:'TV Display'},
  {id:'loft',   name:'Executive Meeting Room', capacity:4,  equip:'Whiteboard'},
  {id:'board',  name:'Large Conference Room',  capacity:14, equip:'Sound System · Video Conference'},
];
```

## 🗄 Data Model (Booking JSON)
```json
{
  "id": "b1704067200000",
  "roomId": "sky",
  "date": "2025-12-31",
  "start": "09:00",
  "end": "10:30",
  "title": "Sales Team Meeting",
  "organizer": "Napas"
}
```

## ⚠️ Known Limitations
- Requires `window.storage` context (e.g., VS Code Live Server, GitHub Pages) — opening via `file://` uses seed data only
- No authentication/authorization (single-user)
- No recurring booking support
- No notification/email integration

## 🗺 Roadmap
### 🔴 High Priority
- [ ] Reliable localStorage fallback (fix `window.storage` dependency)
- [ ] Current time indicator on timeline
- [ ] Prevent past date/time bookings

### 🟡 Medium Priority
- [ ] Week/Month view with drag-to-book
- [ ] Filter rooms by capacity/equipment
- [ ] Keyboard navigation + Focus trap (Accessibility)
- [ ] Loading/Empty states

### 🟢 Low Priority
- [ ] Recurring bookings
- [ ] Dark mode toggle
- [ ] Export/Import CSV/ICS
- [ ] TypeScript + ESLint + Prettier + Unit tests

## 🤝 Contributing
1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License
Distributed under the **MIT License** — see [LICENSE](LICENSE) for details

## 🔗 Links
- **Repository**: https://github.com/nana14329245/Meeting-Room-Booking
- **Live Demo**: https://nana14329245.github.io/Meeting-Room-Booking/ *(enable GitHub Pages in Settings → Pages)*
- **Thai Version**: [README.th.md](README.th.md)