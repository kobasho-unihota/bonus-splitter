"use client";
import { useState } from "react";
import { formatLine } from "../lib/format";

export default function Home() {
  const [year, setYear] = useState(2025);
  const [season, setSeason] = useState("冬");
  const [shogo, setShogo] = useState(1042272);
  const [kana, setKana] = useState(388768);
  const [loan, setLoan] = useState(259436);
  const [result, setResult] = useState("");

  const calc = () => {
    setResult(formatLine(year, season, shogo, kana, loan));
  };

  return (
    <main style={{ padding: 20, maxWidth: 600 }}>
      <h1>ボーナス配分計算</h1>

      <label>
        年：
        <input type="number" value={year} onChange={e => setYear(+e.target.value)} />
      </label>
      <br />

      <label>
        季節：
        <select value={season} onChange={e => setSeason(e.target.value)}>
          <option>夏</option>
          <option>冬</option>
        </select>
      </label>
      <br />

      <label>
        しょうご：
        <input type="number" value={shogo} onChange={e => setShogo(+e.target.value)} />
      </label>
      <br />

      <label>
        かな：
        <input type="number" value={kana} onChange={e => setKana(+e.target.value)} />
      </label>
      <br />

      <label>
        ローン：
        <input type="number" value={loan} onChange={e => setLoan(+e.target.value)} />
      </label>
      <br /><br />

      <button onClick={calc}>計算</button>
      <button onClick={() => navigator.clipboard.writeText(result)} style={{ marginLeft: 8 }}>
        コピー
      </button>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{result}</pre>
    </main>
  );
}