# ระบบจองห้องประชุม (Meeting Room Booking)

> ระบบจองห้องประชุมแบบเรียลไทม์ พัฒนาด้วย Vanilla HTML/CSS/JS — ไม่ต้อง build ใช้งานได้ทันที

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-Thai-orange.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow.svg)

## 📸 สกรีนชอต
<!-- เพิ่มรูปจริงภายหลัง -->
| รายการห้อง | ไทม์ไลน์จอง | มอดอลจองห้อง |
|:---:|:---:|:---:|
| ![rooms](screenshots/rooms.png) | ![timeline](screenshots/timeline.png) | ![modal](screenshots/modal.png) |

## ✨ คุณสมบัติ
- 🏢 **4 ห้องประชุม** — แยกตามฝ่าย/ความจุ/อุปกรณ์
- ⏰ **จองแบบ 30 นาที** — เวลา 08:00–20:00
- 🔄 **สถานะเรียลไทม์** — แฟลปแอนิเมชันแสดงว่าง/ไม่ว่าง อัปเดตทุก 30 วินาที
- 📅 **นำทางวันที่** — กดปุ่มวันก่อน/วันหลัง/วันนี้
- ❌ **ยกเลิกการจอง** — กด × บนบล็อกการจอง
- 💾 **บันทึกอัตโนมัติ** — ใช้ `window.storage` API รองรับ localStorage fallback
- 📱 **Responsive** — ใช้งานบนมือถือและเดสก์ท็อปได้

## 🛠 เทคสแต็ก
| ประเภท | รายละเอียด |
|--------|-----------|
| **Frontend** | HTML5, CSS3 (CSS Variables), Vanilla ES6+ |/
| **Fonts** | Space Grotesk, Inter, IBM Plex Mono (Google Fonts) |
| **Storage** | `window.storage` API + localStorage fallback |
| **Architecture** | Single-file modules, ไม่ต้อง build |

## 🚀 เริ่มต้นใช้งาน
```bash
git clone https://github.com/nana14329245/Meeting-Room-Booking.git
cd Meeting-Room-Booking
# เปิด index.html โดยตรงในเบราว์เซอร์
# หรือใช้ live server (VS Code Live Server, npx serve, ฯลฯ)
```
> **ไม่ต้อง `npm install` หรือ build ใดๆ**

## 📖 วิธีใช้
1. **เลือกห้อง** — คลิกการ์ดห้องทางซ้าย (ห้องที่เลือกจะมีขอบดำ)
2. **เลือกวันที่** — กด ‹ / › / "วันนี้" บนแถบนบน
3. **จองห้อง** — คลิกช่วงเวลาว่าง (สีขาว) บนไทม์ไลน์ หรือกด "+ จองห้องนี้"
4. **กรอกข้อมูล** — หัวข้อประชุม, ชื่อผู้จอง, เวลาเริ่ม-สิ้นสุด
5. **ยืนยัน** — กด "ยืนยันการจอง"
6. **ยกเลิก** — คลิก × บนบล็อกการจองที่ต้องการลบ

## 📁 โครงสร้างโปรเจกต์
```
Meeting-Room-Booking/
├── index.html      # โครงสร้าง UI หลัก (60 บรรทัด)
├── script.js       # Logic ทั้งหมด (325 บรรทัด)
│   ├── ROOMS config, time utils
│   ├── storage (load/save/seed)
│   ├── booking CRUD + conflict check
│   ├── render: room list, status board, timeline, modal
│   └── event handlers + init
└── style.css       # Styling ทั้งหมด (238 บรรทัด)
    ├── CSS Variables (theme colors)
    ├── Layout: grid, responsive
    ├── Components: cards, flaps, timeline, modal
    └── Animations: flap flip, hover states
```

## ⚙️ การตั้งค่า (แก้ไขใน `script.js`)
```js
const OPEN_HOUR = 8;        // เวลาเปิด (08:00)
const CLOSE_HOUR = 20;      // เวลาปิด (20:00)
const STORAGE_KEY = 'roombooking:bookings';

const ROOMS = [
  {id:'sky',    name:'ห้องประชุมฝ่ายขาย',       capacity:10, equip:'โปรเจคเตอร์ · วิดีโอคอนเฟอเรนซ์'},
  {id:'harbor', name:'ห้องประชุมฝ่ายบุคคล',     capacity:6,  equip:'จอทีวี'},
  {id:'loft',   name:'ห้องประชุมผู้บริหาร',       capacity:4,  equip:'ไวท์บอร์ด'},
  {id:'board',  name:'ห้องประชุมใหญ่',          capacity:14, equip:'ระบบเสียง · วิดีโอคอนเฟอเรนซ์'},
];
```

## 🗄 โมเดลข้อมูล (Booking JSON)
```json
{
  "id": "b1704067200000",
  "roomId": "sky",
  "date": "2025-12-31",
  "start": "09:00",
  "end": "10:30",
  "title": "ประชุมทีมขาย",
  "organizer": "นภัส"
}
```

## ⚠️ ข้อจำกัดที่ทราบ
- ต้องรันบนบริบทที่มี `window.storage` (เช่น VS Code Live Server, GitHub Pages) — เปิด `file://` โดยตรงจะใช้ seed data แทน
- ไม่มีระบบ authentication/authorization (single-user)
- ไม่รองรับ recurring bookings (จองซ้ำอัตโนมัติ)
- ไม่มี notification/email integration

## 🗺 แผนพัฒนา (Roadmap)
### 🔴 Priority High
- [ ] localStorage fallback ที่แน่นอน (แก้ `window.storage` dependency)
- [ ] Current time indicator บนไทม์ไลน์
- [ ] ป้องกันการจองย้อนหลัง (วันที่/เวลาที่ผ่านไป)

### 🟡 Priority Medium
- [ ] Week/Month view + drag-to-book
- [ ] กรองห้องตามความจุ/อุปกรณ์
- [ ] Keyboard navigation + Focus trap (Accessibility)
- [ ] Loading/Empty states

### 🟢 Priority Low
- [ ] Recurring bookings
- [ ] Dark mode toggle
- [ ] Export/Import CSV/ICS
- [ ] TypeScript + ESLint + Prettier + Unit tests

## 🤝 การมีส่วนร่วม
1. Fork repo
2. สร้าง branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. เปิด Pull Request

## 📄 License
Distributed under the **MIT License** — ดูรายละเอียดใน [LICENSE](LICENSE)

## 🔗 Links
- **Repository**: https://github.com/nana14329245/Meeting-Room-Booking
- **Live Demo**: https://nana14329245.github.io/Meeting-Room-Booking/ *(เปิดใช้งาน GitHub Pages ใน Settings → Pages)*
- **English Version**: [README.md](README.md)