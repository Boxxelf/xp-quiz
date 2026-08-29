export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
* { -webkit-tap-highlight-color: transparent; }
button { font-family: inherit; }
button:focus-visible { outline: 2px solid #c9a227; outline-offset: 3px; }

@keyframes riseIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:none; } }
@keyframes cardInDown { from { opacity:0; transform: translateY(22px) scale(.975); } to { opacity:1; transform:none; } }
@keyframes cardInUp { from { opacity:0; transform: translateY(-22px) scale(.975); } to { opacity:1; transform:none; } }
@keyframes cardWin {
  0% { transform: none; }
  38% { transform: scale(1.035); box-shadow: 0 0 0 3px rgba(201,162,39,.55), 0 10px 26px rgba(59,15,26,.14); }
  100% { opacity:0; transform: scale(1.06) translateY(-8px); }
}
@keyframes cardOut { 0% { transform:none; } 100% { opacity:0; transform: translateY(20px) scale(.93) rotate(-2deg); } }
@keyframes stampIn { from { opacity:0; transform: rotate(-14deg) scale(1.6); } to { opacity:.88; transform: rotate(-14deg) scale(1); } }
@keyframes drawThread { from { stroke-dashoffset: 190; } to { stroke-dashoffset: 0; } }
@keyframes vsPulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
@keyframes roundFlash { 0% { opacity:0; transform: scale(.9); } 22% { opacity:1; transform: scale(1); } 78% { opacity:1; } 100% { opacity:0; } }

.rise { animation: riseIn .45s cubic-bezier(.22,1,.36,1) both; }
.pair-a { animation: cardInDown .42s cubic-bezier(.22,1,.36,1) both; }
.pair-b { animation: cardInDown .42s cubic-bezier(.22,1,.36,1) .07s both; }
.back-a { animation: cardInUp .42s cubic-bezier(.22,1,.36,1) both; }
.back-b { animation: cardInUp .42s cubic-bezier(.22,1,.36,1) .07s both; }
.win { animation: cardWin .46s cubic-bezier(.4,0,.2,1) both; }
.out { animation: cardOut .46s cubic-bezier(.4,0,.2,1) .09s both; }
.stamp { animation: stampIn .26s cubic-bezier(.34,1.56,.64,1) .12s both; }
.thread path.line { stroke-dasharray: 190; animation: drawThread 1.1s cubic-bezier(.22,1,.36,1) both; }
.vs { animation: vsPulse 2.4s ease-in-out infinite; }
.round-flash { animation: roundFlash 1.5s ease both; }

.tap:active { transform: scale(.975) !important; transition: transform .07s ease !important; }
.ghost-tap:active { background: rgba(59,15,26,.06) !important; }
.hub-tap:active { transform: scale(.985) !important; background: #fffdf6 !important; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; animation-delay:0ms !important; transition-duration:.01ms !important; }
}
`;

export const buzz = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (e) {} };

/** 锦标赛轮次名：64 → "64 强"，2 → "决赛" */
export function roundName(size) {
  if (size <= 2) return "决赛";
  if (size <= 4) return "四强";
  return `${size} 强`;
}

export const S = {
  app: { minHeight: "100vh", background: "linear-gradient(180deg,#f5eddd 0%,#eee1c6 100%)", fontFamily: "'Noto Sans SC',sans-serif", color: "#2b1a14", display: "flex", justifyContent: "center" },
  screen: { width: "100%", maxWidth: 460, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 22px 44px", boxSizing: "border-box" },
  eyebrow: { marginTop: 14, fontSize: 12, letterSpacing: ".3em", color: "#b5202f", fontWeight: 500 },
  h1: { fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 40, margin: "8px 0 14px", color: "#3b0f1a", letterSpacing: ".04em" },
  sub: { fontSize: 14, lineHeight: 1.9, color: "#5c463c", marginBottom: 22, whiteSpace: "pre-line" },
  panel: { background: "#fffaf0", border: "1px solid rgba(59,15,26,.1)", borderRadius: 14, padding: "16px 18px", marginBottom: 26, boxShadow: "0 2px 10px rgba(59,15,26,.06)" },
  panelText: { fontSize: 13.5, lineHeight: 2, color: "#4a362d", margin: 0, whiteSpace: "pre-line" },
  btnPrimary: { width: "100%", padding: "15px 0", fontSize: 15.5, fontWeight: 700, letterSpacing: ".1em", color: "#fffaf0", background: "linear-gradient(180deg,#c22a3a,#9c1c2a)", border: "none", borderRadius: 999, boxShadow: "0 6px 16px rgba(154,28,42,.32)", cursor: "pointer" },
  btnGhost: { width: "100%", padding: "15px 0", fontSize: 15.5, fontWeight: 700, letterSpacing: ".1em", color: "#3b0f1a", background: "transparent", border: "1.5px solid rgba(59,15,26,.22)", borderRadius: 999, cursor: "pointer" },

  hubCard: { display: "block", width: "100%", textAlign: "left", background: "#fffaf0", border: "1px solid rgba(59,15,26,.12)", borderRadius: 16, padding: "18px 20px", marginBottom: 12, cursor: "pointer", boxShadow: "0 3px 12px rgba(59,15,26,.07)", transition: "transform .12s ease, background .15s ease" },
  hubTitle: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 21, color: "#3b0f1a", marginBottom: 5 },
  hubMeta: { fontSize: 11.5, color: "#a8861d", fontWeight: 600, letterSpacing: ".06em", marginBottom: 7 },
  hubDesc: { fontSize: 12.5, lineHeight: 1.75, color: "#7a6154", fontWeight: 300, whiteSpace: "pre-line" },

  progLabel: { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6b5648", marginBottom: 7, fontWeight: 600, letterSpacing: ".05em" },
  progTrack: { height: 3, background: "rgba(59,15,26,.12)", borderRadius: 3, overflow: "hidden" },
  progFill: { height: "100%", background: "linear-gradient(90deg,#c9a227,#b5202f)", transition: "width .35s ease" },
  progSub: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11, marginBottom: 20 },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: "none", padding: "6px 9px 6px 4px", marginLeft: -4, borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: "#8a7565", letterSpacing: ".04em", transition: "opacity .22s ease, background .15s ease" },
  groupTag: { fontFamily: "'Noto Serif SC',serif", fontSize: 11, color: "#9a8574", letterSpacing: ".14em" },
  matchArea: { display: "flex", flexDirection: "column" },

  card: { width: "100%", background: "#fffaf0", border: "2px solid rgba(59,15,26,.13)", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9, padding: "24px 18px", cursor: "pointer", position: "relative", transition: "border-color .2s ease, box-shadow .2s ease", boxShadow: "0 4px 14px rgba(59,15,26,.08)" },
  cardName: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 25, color: "#3b0f1a", letterSpacing: ".07em", textAlign: "center" },
  cardDesc: { fontSize: 12.5, lineHeight: 1.7, color: "#7a6154", textAlign: "center", fontWeight: 300, maxWidth: 250 },
  stamp: { position: "absolute", top: 10, right: 12, fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 12, color: "#b5202f", border: "2px solid #b5202f", borderRadius: 5, padding: "1px 5px", transform: "rotate(-14deg)" },
  vs: { fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 12, color: "#c9a227", letterSpacing: ".2em", margin: "10px 0", textAlign: "center" },
  hint: { textAlign: "center", fontSize: 11.5, color: "#8a7565", marginTop: 24, letterSpacing: ".05em" },

  code: { fontFamily: "'Noto Serif SC',serif", fontSize: 15, fontWeight: 700, letterSpacing: ".2em", color: "#a8861d", marginTop: 10 },
  rarity: { display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "#b5202f", background: "rgba(181,32,47,.09)", border: "1px solid rgba(181,32,47,.2)", borderRadius: 999, padding: "5px 13px", letterSpacing: ".03em" },
  verdict: { fontFamily: "'Noto Serif SC',serif", fontSize: 16, lineHeight: 1.85, color: "#3b0f1a", margin: "18px 0 4px", fontWeight: 600 },

  section: { marginTop: 30 },
  sectionLabel: { fontSize: 11, letterSpacing: ".26em", color: "#9a8574", fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(59,15,26,.11)" },
  plain: { fontSize: 13.5, lineHeight: 1.95, color: "#4a362d", margin: 0 },

  barHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", fontSize: 11.5, marginBottom: 6 },
  barSide: { flex: 1, letterSpacing: ".03em" },
  barAxis: { fontFamily: "'Noto Serif SC',serif", fontSize: 11, color: "#9a8574", letterSpacing: ".12em", padding: "0 8px" },
  barTrack: { position: "relative", height: 7, background: "rgba(59,15,26,.1)", borderRadius: 7, overflow: "hidden" },
  barFill: { position: "absolute", left: 0, top: 0, height: "100%", background: "linear-gradient(90deg,#c9a227,#b5202f)", borderRadius: 7, transition: "width .95s cubic-bezier(.22,1,.36,1)" },
  barMid: { position: "absolute", left: "50%", top: -2, width: 1, height: 11, background: "rgba(59,15,26,.28)" },

  row: { display: "flex", gap: 12, alignItems: "flex-start", background: "#fffaf0", border: "1px solid rgba(59,15,26,.1)", borderRadius: 12, padding: "13px 15px", marginBottom: 8 },
  rowIdx: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 12, color: "#c9a227", paddingTop: 3 },
  rowName: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 16.5, color: "#3b0f1a", marginBottom: 3 },
  rowDesc: { fontSize: 12, lineHeight: 1.65, color: "#7a6154", fontWeight: 300 },

  pairRow: { display: "flex", alignItems: "center", gap: 10 },
  pairTag: { fontSize: 10.5, fontWeight: 600, color: "#fffaf0", background: "#b5202f", borderRadius: 5, padding: "3px 8px", letterSpacing: ".05em", whiteSpace: "nowrap" },
  pairName: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 16, color: "#3b0f1a" },
  pairNote: { fontSize: 12, lineHeight: 1.8, color: "#7a6154", margin: "6px 0 0", fontWeight: 300 },

  champ: { background: "#fffaf0", border: "2px solid rgba(201,162,39,.5)", borderRadius: 18, padding: "26px 20px", textAlign: "center", boxShadow: "0 6px 20px rgba(59,15,26,.1)" },
  champLabel: { fontSize: 11, letterSpacing: ".3em", color: "#a8861d", fontWeight: 600 },
  champName: { fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 36, color: "#3b0f1a", margin: "10px 0 8px", letterSpacing: ".05em" },
  champDesc: { fontSize: 13, lineHeight: 1.8, color: "#7a6154", fontWeight: 300 },
  chip: { display: "inline-block", fontFamily: "'Noto Serif SC',serif", fontSize: 13.5, fontWeight: 600, color: "#3b0f1a", background: "#fffaf0", border: "1px solid rgba(59,15,26,.13)", borderRadius: 999, padding: "7px 14px", margin: "0 6px 8px 0" },
  chipWrap: { display: "flex", flexWrap: "wrap" },
  roundFlash: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 30 },
  roundFlashText: { fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 62, color: "rgba(181,32,47,.16)", letterSpacing: ".14em" },
};
