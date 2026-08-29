import React, { useState, useRef, useCallback, useEffect } from "react";
import { Bracket, totalMatches, score, codeOf, pairing, podium } from "./engine.js";
import { CSS, S, buzz, roundName } from "./ui.js";
import { posterProfile, posterTournament } from "./poster.js";
import * as XP from "./data-xp.js";
import * as SEAT from "./data-seat.js";
import * as TROPES from "./data-tropes.js";

/* 三条赛道 */
const QUIZZES = [
  { ...XP.META, groups: XP.GROUPS, axes: XP.AXES, types: XP.TYPES },
  { ...SEAT.META, groups: SEAT.GROUPS, axes: SEAT.AXES, types: SEAT.TYPES },
  { ...TROPES.META_V1, groups: TROPES.GROUPS_V1 },
  { ...TROPES.META_V2, groups: TROPES.GROUPS_V2 },
];

export default function XPQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [stage, setStage] = useState("hub");
  const b = useRef(null);
  const [, tick] = useState(0);
  const [fx, setFx] = useState(null);
  const [dir, setDir] = useState("fwd");

  const open = (q) => { setQuiz(q); setStage("intro"); };
  const start = () => { b.current = new Bracket(quiz.groups); setDir("fwd"); setStage("quiz"); };
  const home = () => { b.current = null; setQuiz(null); setStage("hub"); };

  const pick = useCallback((i) => {
    if (fx !== null) return;
    buzz(8); setFx(i); setDir("fwd");
    setTimeout(() => {
      b.current.pick(i); setFx(null);
      if (b.current.finished()) setStage("result"); else tick((t) => t + 1);
    }, 440);
  }, [fx]);

  const back = useCallback(() => {
    if (fx !== null || !b.current?.canUndo()) return;
    buzz(5); b.current.undo(); setDir("back"); tick((t) => t + 1);
  }, [fx]);

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      {stage === "hub" && <Hub onOpen={open} />}
      {stage === "intro" && <Intro quiz={quiz} onStart={start} onHome={home} />}
      {stage === "quiz" && b.current && (
        <Quiz
          quiz={quiz} b={b.current} m={b.current.match()}
          fx={fx} dir={dir} onPick={pick} onBack={back}
        />
      )}
      {stage === "result" && (
        quiz.mode === "tournament"
          ? <TournamentResult quiz={quiz} b={b.current} onRestart={start} onHome={home} />
          : <ProfileResult quiz={quiz} b={b.current} onRestart={start} onHome={home} />
      )}
    </div>
  );
}

function Thread() {
  return (
    <svg className="thread" width="128" height="44" viewBox="0 0 128 44" fill="none" style={{ display: "block", margin: "0 auto" }} aria-hidden="true">
      <path className="line" d="M4 10 C 44 42, 84 -8, 124 24" stroke="#b5202f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="124" cy="24" r="3.2" fill="#c9a227" />
      <path d="M124 27 L124 39 M121 30 L118 41 M127 30 L130 41" stroke="#c9a227" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="4" cy="10" r="2.8" fill="#b5202f" />
    </svg>
  );
}

function Hub({ onOpen }) {
  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Thread />
        <div style={S.eyebrow}>同 人 女 · 测 试 合 集</div>
        <h1 style={{ ...S.h1, fontSize: 36 }}>选一个开始</h1>
      </div>
      {QUIZZES.map((q) => {
        const n = totalMatches(q.groups);
        const pool = q.groups.reduce((s, g) => s + g.length, 0);
        return (
          <button key={q.id} className="hub-tap" style={S.hubCard} onClick={() => onOpen(q)}>
            <div style={S.hubMeta}>
              {pool} 个词条 · {n} 回合 · {q.mode === "tournament" ? "锦标赛" : "四维人格"}
            </div>
            <div style={S.hubTitle}>{q.title}</div>
            <div style={S.hubDesc}>{q.tagline}</div>
          </button>
        );
      })}
      <p style={{ ...S.hint, marginTop: 18 }}>四条赛道互不影响，随时可以换</p>
    </div>
  );
}

function Intro({ quiz, onStart, onHome }) {
  const n = totalMatches(quiz.groups);
  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center" }}>
        <Thread />
        <div style={S.eyebrow}>{quiz.eyebrow}</div>
        <h1 style={S.h1}>{quiz.title}</h1>
        <p style={S.sub}>{quiz.tagline}</p>
        <div style={S.panel}><p style={S.panelText}>{quiz.rule}</p></div>
        <button className="tap" style={S.btnPrimary} onClick={onStart}>开始测试</button>
        <button className="tap ghost-tap" style={{ ...S.btnGhost, marginTop: 10 }} onClick={onHome}>换一个测试</button>
      </div>
    </div>
  );
}

function Quiz({ quiz, b, m, fx, dir, onPick, onBack }) {
  const total = totalMatches(quiz.groups);
  const pct = Math.round((b.done / total) * 100);
  const resolving = fx !== null;
  const enterA = dir === "back" ? "back-a" : "pair-a";
  const enterB = dir === "back" ? "back-b" : "pair-b";
  const tourney = quiz.mode === "tournament";
  const size = b.roundSize();

  // 锦标赛进入新一轮时闪一下轮次名
  const [flash, setFlash] = useState(null);
  const lastSize = useRef(size);
  useEffect(() => {
    if (tourney && size !== lastSize.current) {
      lastSize.current = size;
      setFlash(roundName(size));
      const id = setTimeout(() => setFlash(null), 1500);
      return () => clearTimeout(id);
    }
    lastSize.current = size;
  }, [size, tourney]);

  return (
    <div style={S.screen}>
      {flash && (
        <div style={S.roundFlash}>
          <div className="round-flash" style={S.roundFlashText}>{flash}</div>
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <div style={S.progLabel}>
          <span>第 {b.done + 1} / {total} 回合</span>
          <span style={{ color: "#a8861d" }}>{pct}%</span>
        </div>
        <div style={S.progTrack}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>
        <div style={S.progSub}>
          <button
            className="ghost-tap"
            style={{ ...S.backBtn, opacity: b.canUndo() && !resolving ? 1 : 0.28, cursor: b.canUndo() && !resolving ? "pointer" : "default" }}
            onClick={onBack} disabled={!b.canUndo() || resolving} aria-label="返回上一题"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一题
          </button>
          <span style={S.groupTag}>
            {tourney ? roundName(size) : `第 ${b.gi + 1} / ${quiz.groups.length} 组`}
          </span>
        </div>
      </div>

      <div key={b.done} style={S.matchArea}>
        <Card t={m[0]} onClick={() => onPick(0)} anim={resolving ? (fx === 0 ? "win" : "out") : enterA} out={fx === 1} locked={resolving} />
        <div className="vs" style={S.vs}>VS</div>
        <Card t={m[1]} onClick={() => onPick(1)} anim={resolving ? (fx === 1 ? "win" : "out") : enterB} out={fx === 0} locked={resolving} />
      </div>
      <p style={S.hint}>点击你更心动的那一个</p>
    </div>
  );
}

function Card({ t, onClick, anim, out, locked }) {
  return (
    <button className={`${anim} ${locked ? "" : "tap"}`} onClick={onClick} disabled={locked} style={S.card}>
      <span style={S.cardName}>{t.name}</span>
      {t.desc && <span style={S.cardDesc}>{t.desc}</span>}
      {out && <span className="stamp" style={S.stamp}>出局</span>}
    </button>
  );
}

function Section({ label, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionLabel}>{label}</div>
      {children}
    </div>
  );
}

function Bar({ ax, pct, delay = 0 }) {
  const [w, setW] = useState(50);
  useEffect(() => {
    const id = setTimeout(() => setW(pct), 120 + delay);
    return () => clearTimeout(id);
  }, [pct, delay]);
  const dom = pct >= 50;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={S.barHead}>
        <span style={{ ...S.barSide, color: !dom ? "#b5202f" : "#9a8574", fontWeight: !dom ? 700 : 400 }}>
          {ax.negLabel} {100 - pct}%
        </span>
        <span style={S.barAxis}>{ax.name}</span>
        <span style={{ ...S.barSide, textAlign: "right", color: dom ? "#b5202f" : "#9a8574", fontWeight: dom ? 700 : 400 }}>
          {pct}% {ax.posLabel}
        </span>
      </div>
      <div style={S.barTrack}>
        <div style={{ ...S.barFill, width: `${w}%` }} />
        <div style={S.barMid} />
      </div>
    </div>
  );
}

function useShare() {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");
  const run = async (fn) => {
    setSaving(true);
    try { await fn(); } catch (e) { setErr("图片没能生成，换个浏览器再试一次"); }
    setSaving(false);
  };
  const copy = (txt) => {
    navigator.clipboard?.writeText(txt)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })
      .catch(() => setErr("复制失败，长按上面的文字手动选中"));
  };
  return { saving, copied, err, run, copy };
}

function Actions({ share, onSave, onCopy, onRestart, onHome }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
      <button className="tap" style={{ ...S.btnPrimary, opacity: share.saving ? 0.6 : 1 }} disabled={share.saving} onClick={onSave}>
        {share.saving ? "正在生成…" : "保存结果长图"}
      </button>
      <button className="tap ghost-tap" style={S.btnGhost} onClick={onCopy}>{share.copied ? "已复制" : "复制文字版"}</button>
      <button className="tap ghost-tap" style={S.btnGhost} onClick={onRestart}>再测一次</button>
      <button className="tap ghost-tap" style={{ ...S.btnGhost, border: "none", color: "#8a7565", fontSize: 13 }} onClick={onHome}>回到测试合集</button>
      {share.err && <p style={{ ...S.pairNote, textAlign: "center", color: "#b5202f" }}>{share.err}</p>}
    </div>
  );
}

/* ---------- 人格版结果 ---------- */
function ProfileResult({ quiz, b, onRestart, onHome }) {
  const share = useShare();
  const { axes, types } = quiz;
  const pcts = score(b.log);
  const code = codeOf(pcts, axes);
  const type = types[code];
  const { ally, clash, softest } = pairing(code, pcts, axes);

  const dir = pcts.map((p) => (p - 50) / 50);
  const top3 = [...b.champions]
    .map((c) => ({ c, s: c.a.reduce((sum, v, k) => sum + v * dir[k], 0) }))
    .sort((x, y) => y.s - x.s).slice(0, 3).map((x) => x.c);

  const txt = `我的${quiz.title}人格：${code} 「${type.name}」\n${type.verdict}\n全站占比 ${type.rarity}%\n本命：${top3.map((t) => t.name).join(" / ")}`;

  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center" }}>
        <Thread />
        <div style={S.eyebrow}>你的 {quiz.title.replace("二选一", "").trim()} 人格</div>
        <div style={S.code}>{code.split("").join(" · ")}</div>
        <h1 style={{ ...S.h1, fontSize: 34, margin: "4px 0 10px" }}>{type.name}</h1>
        <div style={S.rarity}>全站只有 {type.rarity}% 的人是{type.name}</div>
        <div style={S.verdict}>“{type.verdict}”</div>
      </div>

      <Section label="倾向图">
        {axes.map((ax, i) => <Bar key={i} ax={ax} pct={pcts[i]} delay={i * 110} />)}
      </Section>

      <Section label="你的本命">
        {top3.map((t, i) => (
          <div key={i} style={S.row}>
            <span style={S.rowIdx}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div style={S.rowName}>{t.name}</div>
              <div style={S.rowDesc}>{t.desc}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section label="你的雷点"><p style={S.plain}>{type.weak}</p></Section>

      <Section label="CP 配对">
        <div style={S.pairRow}>
          <span style={S.pairTag}>能聊到天亮</span>
          <span style={S.pairName}>{types[ally].name}</span>
        </div>
        <p style={S.pairNote}>你在「{axes[softest].name}」这一维最松动，正好接得住ta。</p>
        <div style={{ ...S.pairRow, marginTop: 14 }}>
          <span style={{ ...S.pairTag, background: "#3b0f1a" }}>最好别开同一辆车</span>
          <span style={S.pairName}>{types[clash].name}</span>
        </div>
        <p style={S.pairNote}>四维全反，你们连吵架都吵不到一个点上。</p>
      </Section>

      <Actions
        share={share}
        onSave={() => share.run(() => posterProfile({
          meta: quiz, axes, code, type, pcts, top3,
          allyName: types[ally].name, clashName: types[clash].name,
        }))}
        onCopy={() => share.copy(txt)}
        onRestart={onRestart} onHome={onHome}
      />
    </div>
  );
}

/* ---------- 锦标赛结果 ---------- */
function TournamentResult({ quiz, b, onRestart, onHome }) {
  const share = useShare();
  const { gold, silver, semi, quarter } = podium(b.log);

  const txt = `我的${quiz.title}冠军：${gold.name}\n决赛淘汰了 ${silver.name}\n四强：${semi.map((s) => s.name).join("、")}`;

  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <Thread />
        <div style={S.eyebrow}>{quiz.eyebrow}</div>
        <h1 style={{ ...S.h1, fontSize: 30, margin: "6px 0 20px" }}>你的本命文梗</h1>
      </div>

      <div style={S.champ}>
        <div style={S.champLabel}>冠 军</div>
        <div style={S.champName}>{gold.name}</div>
        <div style={S.champDesc}>{gold.desc}</div>
      </div>

      <Section label="决赛败者">
        <div style={S.row}>
          <span style={S.rowIdx}>02</span>
          <div>
            <div style={S.rowName}>{silver.name}</div>
            <div style={S.rowDesc}>{silver.desc}</div>
          </div>
        </div>
      </Section>

      <Section label="四强">
        <div style={S.chipWrap}>
          {semi.map((s, i) => <span key={i} style={S.chip}>{s.name}</span>)}
        </div>
      </Section>

      <Section label="八强">
        <div style={S.chipWrap}>
          {quarter.map((s, i) => <span key={i} style={{ ...S.chip, fontSize: 12.5, padding: "6px 12px" }}>{s.name}</span>)}
        </div>
      </Section>

      <Actions
        share={share}
        onSave={() => share.run(() => posterTournament({ meta: quiz, gold, silver, semi, quarter }))}
        onCopy={() => share.copy(txt)}
        onRestart={onRestart} onHome={onHome}
      />
    </div>
  );
}
