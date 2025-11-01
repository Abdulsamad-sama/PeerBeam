"use client";
import BackToHomeBtn from "@/components/BackBtn/BackBtn";
import React from "react";

const About = () => {
  return (
    <main className="relative overflow flex flex-col gap-8 items-center justify-center max-w-2xl mx-auto px-4 py-10">
      <BackToHomeBtn />
      <h1 className="text-4xl font-bold mb-4">
        PeerBeam
        <span className="italic text-xs text-gray-500">Version 1.0</span>
      </h1>
      <p className="text-lg mb-6">
        ⚡ A blazing-fast, peer-to-peer file transfer web app powered by WebRTC,
        with zero internet dependency after initial connection. Just scan,
        connect, and share — all in your browser.
      </p>
      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🚀 Features</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            📡 <b>Peer-to-peer file sharing</b> over local network using WebRTC
          </li>
          <li>
            📱 <b>Progressive Web App (PWA)</b> — install it like a native app
          </li>
          <li>
            🌐 <b>Minimal signaling server</b> for WebRTC connection
            bootstrapping
          </li>
          <li>
            📷 <b>QR Code-based pairing</b> for fast & easy device discovery
          </li>
          <li>
            🎨 <b>Responsive UI</b> built with Next.js + Tailwind CSS
          </li>
          <li>
            🔐 <b>No cloud storage</b> – files are never uploaded anywhere
          </li>
        </ul>
      </section>

      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🛠️ Tech Stack</h2>
        <h3 className="text-xl font-bold mt-4 mb-2">Frontend</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <b>Next.js</b> – React-based web framework
          </li>
          <li>
            <b>Tailwind CSS</b> – Utility-first styling
          </li>
          <li>
            <b>react-qr-code</b> – QR code generation for connection info
          </li>
          <li>
            <b>WebRTC</b> – Direct peer-to-peer data channels
          </li>
          <li>
            <b>PWA support</b> – Offline-ready via service workers
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-4 mb-2">
          Backend (Signaling Only)
        </h3>
        <ul className="list-disc pl-6">
          <li>
            <b>Node.js + Socket.IO</b> – Light signaling server
          </li>
          <li>
            <b>WebSocket</b> – Alternative signaling approach (TBD)
          </li>
        </ul>
      </section>

      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          📦 Installation (Coming Soon)
        </h2>
        <blockquote className="italic text-gray-600 mb-2">
          Note: The project is currently under development.
        </blockquote>
        <ol className="list-decimal pl-6 mb-2">
          <li>Clone the repo</li>
          <li>Install dependencies</li>
          <li>Run the signaling server</li>
          <li>Launch the frontend</li>
        </ol>
      </section>

      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🔍 Roadmap</h2>
        <ul className="list-disc pl-6">
          <li>
            <span className="line-through">Project setup</span>
          </li>
          <li>PWA implementation</li>
          <li>QR-based pairing</li>
          <li>WebRTC data channel logic</li>
          <li>Backend signaling server</li>
          <li>File transfer UI/UX</li>
          <li>Local discovery over LAN</li>
        </ul>
      </section>

      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📸 Screenshots</h2>
        <p className="text-gray-600">
          (Coming soon) – UI previews and QR scan flow
        </p>
      </section>

      <hr className="my-6" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🤝 Contributing</h2>
        <p>
          Contributions are welcome! Once the core is stable, I’ll add a
          CONTRIBUTING.md file.
        </p>
      </section>

      <hr className="my-6" />

      <section>
        <h2 className="text-2xl font-semibold mb-2">📄 License</h2>
        <p>MIT License — free to use and modify.</p>
      </section>
    </main>
  );
};

export default About;
