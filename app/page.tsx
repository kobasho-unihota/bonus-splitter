"use client";
import { useState } from "react";
import { formatLine } from "../lib/format";

export default function Home() {
  const [text, setText] = useState("");

  const calc = () => {
    setText(
      formatLine(2025, "冬", 1042272, 388768, 259436)
    );
  };

  return (
    <main style={{ padding: 20 }}>
      <button onClick={calc}>計算</button>
      <pre>{text}</pre>
      <button onClick={() => navigator.clipboard.writeText(text)}>
        コピー
      </button>
    </main>
  );
}
