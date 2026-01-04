"use client";

import { useMemo, useState } from "react";

type Person = "shogo" | "kana";

type SplitResult = {
  totalBonus: number;
  loan: number;
  remaining: number;

  householdTotal: number; // 家計貯金(80%)
  suki: number;           // すきちょ(20%)
  toku: number;           // 特ちょ(30%)
  gachi: number;          // ガチちょ(50%)

  personalTotal: number;  // 個人枠(20%)
  shogoPocket: number;
  kanaPocket: number;
};

export default function Page() {
  const [total, setTotal] = useState("");
  const [loan, setLoan] = useState("");
  const [person, setPerson] = useState<Person>("shogo");

  const nTotal = toNumber(total);
  const nLoan = toNumber(loan);

  const error = useMemo(() => {
    if (nTotal == null && nLoan == null) return "";
    if (nTotal == null) return "ボーナス合計を入力してください。";
    if (nLoan == null) return "住宅ローン（ボーナス払い）を入力してください。";
    if (nTotal < 0 || nLoan < 0) return "金額は0以上で入力してください。";
    if (nLoan > nTotal) return "ローンのボーナス払いが、ボーナス合計を超えています。";
    return "";
  }, [nTotal, nLoan]);

  const result: SplitResult | null = useMemo(() => {
    if (error) return null;
    if (nTotal == null || nLoan == null) return null;
    return calcSplit(nTotal, nLoan);
  }, [nTotal, nLoan, error]);

  const outText = useMemo(() => {
    if (!result) return "";

    const title = person === "shogo" ? "しょうご" : "かな";

    // ※ ここは「冬/夏」の見出しなど好きに編集OK
    return (
`【ボーナス分配（${title}）】

▶ 総支給額：${yen(result.totalBonus)}
■ 支出：住宅ローンボーナス払い：${yen(result.loan)}

■ 家計貯金（80%）：${yen(result.householdTotal)}
・すきちょ：${yen(result.suki)}
・特ちょ　：${yen(result.toku)}
・ガチちょ：${yen(result.gachi)}

■ 個人枠（20%）：${yen(result.personalTotal)}
・しょうご：${yen(result.shogoPocket)}
・かな　　：${yen(result.kanaPocket)}
`
    );
  }, [result, person]);

  return (
    <main style={{ padding: 20 }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            ボーナス分配（家計貯金 / 個人枠）
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
            数字はカンマ付きで入力OK（自動整形）。家計80%／個人20%、家計内は 20%/30%/残り を配分。
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
          {/* セグメント */}
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
            <Field label="ボーナス合計" value={total} onChange={setTotal} />
            <Field label="住宅ローン ボーナス払い" value={loan} onChange={setLoan} />
          </div>

          {error && (
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
              {error}
            </div>
          )}

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

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
            <button
              onClick={async () => outText && navigator.clipboard.writeText(outText)}
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
            value={outText}
            style={{
              width: "100%",
              marginTop: 12,
              minHeight: 180,
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

/** 夏の実績に合うように「floor + 余りは最後に寄せる」でズレを防ぐ */
function calcSplit(totalBonus: number, loan: number): SplitResult {
  const remaining = totalBonus - loan;

  const householdTotal = Math.floor(remaining * 0.8);
  const personalTotal = remaining - householdTotal;

  const suki = Math.floor(householdTotal * 0.2);
  const toku = Math.floor(householdTotal * 0.3);
  const gachi = householdTotal - suki - toku;

  // 個人枠は等分、端数は後者に寄せる
  const shogoPocket = Math.floor(personalTotal / 2);
  const kanaPocket = personalTotal - shogoPocket;

  return {
    totalBonus,
    loan,
    remaining,
    householdTotal,
    suki,
    toku,
    gachi,
    personalTotal,
    shogoPocket,
    kanaPocket,
  };
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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

// カンマ/全角/円の入力を許容
function toNumber(s: string): number | null {
  if (!s) return null;
  let t = s.trim();
  t = t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  t = t.replace(/[，,￥¥円\s]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function yen(n: number): string {
  return `${n.toLocaleString("ja-JP")}円`;
}
