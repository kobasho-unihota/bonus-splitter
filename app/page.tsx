"use client";
import { useMemo, useState } from "react";
import { formatLine } from "../lib/format";

export default function Home() {
  const [year, setYear] = useState(2025);
  const [season, setSeason] = useState("冬");
  const [shogo, setShogo] = useState(1042272);
  const [kana, setKana] = useState(388768);
  const [loan, setLoan] = useState(259436);

  const [copied, setCopied] = useState(false);

  // 入力が変わるたびに自動で結果生成（「計算」押し忘れ防止）
  const result = useMemo(() => {
    return formatLine(year, season, shogo, kana, loan);
  }, [year, season, shogo, kana, loan]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 16,
    border: "1px solid #ddd",
    borderRadius: 10,
  };

  return (
    <main style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 14 }}>ボーナス配分計算</h1>

      <section style={{ border: "1px solid #eee", borderRadius: 16, padding: 14 }}>
        <div style={rowStyle}>
          <div>年</div>
          <input
            type="number"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div>季節</div>
          <select value={season} onChange={(e) => setSeason(e.target.value)} style={inputStyle}>
            <option value="夏">夏</option>
            <option value="冬">冬</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div>しょうご</div>
          <input
            type="number"
            inputMode="numeric"
            value={shogo}
            onChange={(e) => setShogo(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div>かな</div>
          <input
            type="number"
            inputMode="numeric"
            value={kana}
            onChange={(e) => setKana(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div>ローン</div>
          <input
            type="number"
            inputMode="numeric"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            onClick={onCopy}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: copied ? "#e8fff0" : "white",
              fontSize: 16,
            }}
          >
            {copied ? "コピーしました" : "コピー"}
          </button>
        </div>
      </section>

      <pre
        style={{
          marginTop: 14,
          whiteSpace: "pre-wrap",
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 14,
          background: "#fafafa",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        {result}
      </pre>
    </main>
  );
}