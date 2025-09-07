"use client";
import { useState, useEffect } from "react";

export default function History() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Connection History</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {history.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      <button
        onClick={clearHistory}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear History
      </button>
    </div>
  );
}
