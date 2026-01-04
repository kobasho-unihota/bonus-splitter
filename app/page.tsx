"use client";

import { useMemo, useState } from "react";
// ↓ 既存関数に合わせて import 名は調整してOK
import { calcBonusSplit } from "@/lib/calc";
import { yen } from "@/lib/format";

type Person = "shogo" | "kana";

export default function Page() {
  const [total, setTotal] = useState<string>("");
  const [loan, setLoan] = useState<string>("");
  const [person, setPerson] = useState<Person>("shogo");

  const nTotal = toNumber(total);
  const nLoan = toNumber(loan);

  const result = useMemo(() => {
    if (nTotal == null || nLoan == null) return null;
    if (nTotal < 0 || nLoan < 0) return null;
    if (nLoan > nTotal) return null;

    // ここがあなたの既存計算関数に合わせるポイント
    return calcBonusSplit({
      totalBonus: nTotal,
      loanBonusPay: nLoan,
    });
  }, [nTotal, nLoan]);

  const lineText = useMemo(() => {
    if (!result) return "";
    // ここは既存のフォーマット関数があるならそれを使ってOK
    // result の形に合わせて整えてください
    return result.text ?? "";
  }, [result]);

  return (
    <main style={{ padding: 20 }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            ボーナス分配（家計貯金 / 個人枠）
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
            自然なトーンで見やすく。数字はカンマ付きで入力OK。
          </p>
        </header>

        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            padding: 14,
          }}
        >
          {/* セグメント（見た目だけ。必要なら後で who パラメータにも対応できる） */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 6,
              borderRadius: "var(--radius-s)",
              background: "var(--soft)",
              border: "1px solid var(--line)",
              marginBottom: 14,
            }}
          >
            <SegButton active={person === "shogo"} onClick={() => setPerson("shogo")}>
              しょうご
            </SegButton>
            <SegButton active={person === "kana"} onClick={() => setPerson("kana")}>
              かな
            </SegButton>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field
              label="ボーナス合計"
              value={total}
              onChange={setTotal}
              placeholder=""
            />
            <Field
              label="住宅ローン ボーナス払い"
              value={loan}
              onChange={setLoan}
              placeholder=""
            />
          </div>

          {/* バリデーション */}
          {nTotal != null && nLoan != null && nLoan > nTotal && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(220,38,38,.25)",
                background: "rgba(220,38,38,.08)",
                color: "#8a1f1f",
                fontSize: 13,
              }}
            >
              ローンのボーナス払いが、ボーナス合計を超えています。
            </div>
          )}

          {/* 結果 */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: "var(--radius-s)",
              border: "1px solid var(--line)",
              background: "#fafafa",
            }}
          >
            <KV label="支出：住宅ローンボーナス払い" value={result ? yen(result.loan) : "—"} big />

            <div style={{ height: 10 }} />

            <KV label="家計貯金（80%）" value={result ? yen(result.householdTotal) : "—"} />
            <KV label="・すきちょ" value={result ? yen(result.suki) : "—"} />
            <KV label="・特ちょ" value={result ? yen(result.toku) : "—"} />
            <KV label="・ガチちょ" value={result ? yen(result.gachi) : "—"} />

            <div style={{ height: 10 }} />

            <KV label="個人枠（20%）" value={result ? yen(result.personalTotal) : "—"} />
            <KV label="・しょうご" value={result ? yen(result.shogoPocket) : "—"} />
            <KV label="・かな" value={result ? yen(result.kanaPocket) : "—"} />
          </div>

          {/* コピー */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
            <button
              onClick={async () => lineText && navigator.clipboard.writeText(lineText)}
              style={{
                padding: "12px 14px",
                fontSize: 14,
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "var(--accent-soft)",
                color: "#355f55",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              フォーマットをコピー
            </button>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              LINEにそのまま貼れます
            </span>
          </div>

          <textarea
            readOnly
            value={lineText}
            style={{
              width: "100%",
              marginTop: 12,
              minHeight: 160,
              padding: 12,
              borderRadius: 14,
              border: "1px solid var(--line)",
              background: "#fff",
              fontSize: 13,
              lineHeight: 1.5,
              resize: "vertical",
            }}
          />
        </section>
      </div>
    </main>
  );
}

function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 0",
        borderRadius: 12,
        border: active ? "1px solid var(--line)" : "1px solid transparent",
        background: active ? "#fff" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: 10,
        alignItems: "center",
      }}
    >
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          const n = toNumber(value);
          if (n != null) onChange(n.toLocaleString("ja-JP"));
        }}
        inputMode="numeric"
        placeholder={placeholder ?? ""}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 12,
          border: "1px solid var(--line)",
          background: "#fff",
          minWidth: 0,
        }}
      />
    </div>
  );
}

function KV({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px dashed var(--line)",
      }}
    >
      <div style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>{label}</div>
      <div
        style={{
          fontWeight: 700,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          fontSize: big ? 18 : 14,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// カンマ/全角対応
function toNumber(s: string): number | null {
  if (!s) return null;
  let t = s.trim();
  t = t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  t = t.replace(/[，,￥¥円\s]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
