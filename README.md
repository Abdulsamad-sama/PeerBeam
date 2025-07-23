# PeerBeam

⚡ A blazing-fast, peer-to-peer file transfer web app powered by WebRTC, with zero internet dependency after initial connection. Just scan, connect, and share — all in your browser.

---

## 🚀 Features

- 📡 **Peer-to-peer file sharing** over local network using WebRTC
- 📱 **Progressive Web App (PWA)** — install it like a native app
- 🌐 **Minimal signaling server** for WebRTC connection bootstrapping
- 📷 **QR Code-based pairing** for fast & easy device discovery
- 🎨 **Responsive UI** built with Next.js + Tailwind CSS
- 🔐 **No cloud storage** – files are never uploaded anywhere

---

## 🛠️ Tech Stack

### Frontend

- **Next.js** – React-based web framework
- **Tailwind CSS** – Utility-first styling
- **react-qr-code** – QR code generation for connection info
- **WebRTC** – Direct peer-to-peer data channels
- **PWA support** – Offline-ready via service workers

### Backend (Signaling Only)

- **Node.js + Socket.IO** – Light signaling server
- **WebSocket** – Alternative signaling approach (TBD)

---

## 📦 Installation (Coming Soon)

> _Note: The project is currently under development._

Planned steps:

1. Clone the repo
2. Install dependencies
3. Run the signaling server
4. Launch the frontend

---

## 🔍 Roadmap

- [x] Project setup
- [ ] PWA implementation
- [ ] QR-based pairing
- [ ] WebRTC data channel logic
- [ ] Backend signaling server
- [ ] File transfer UI/UX
- [ ] Local discovery over LAN

---

## 📸 Screenshots

> _(Coming soon)_ – UI previews and QR scan flow

---

## 🤝 Contributing

Contributions are welcome! Once the core is stable, I’ll add a CONTRIBUTING.md file.

---

## 📄 License

MIT License — free to use and modify.
