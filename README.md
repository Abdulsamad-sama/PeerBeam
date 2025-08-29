# PeerBeam

⚡ A blazing-fast, peer-to-peer file transfer web app powered by socket.io, with zero internet dependency after initial connection. Just scan, connect, and share — all in your browser.

---

## 🚀 Features

- 📡 **Peer-to-peer file sharing** over local network using socket.io
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

### Architecture Overview

code
+----------------+ Socket.IO (signaling) +----------------+
| Sender Peer | <-------------------------------------> | Receiver Peer |
+----------------+ +----------------+
| |
| WebRTC PeerConnection (P2P channel via local IP) |
+----------------------------------------------------------+
| Direct Data Transfer (chunks) |
+----------------------------------------------------------+
code

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
- [x] File transfer UI/UX
- [x] PWA implementation
- [x] Backend signaling server
- [ ] QR-based pairing
- [ ] WebRTC data channel logic
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
