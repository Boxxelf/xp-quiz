/* 结果长图：canvas 直接绘制，无外部依赖。两种版式：人格版 / 锦标赛版 */
const W = 1080, PAD = 88;
const CREAM = "#f5eddd", INK = "#3b0f1a", RED = "#b5202f", GOLD = "#a8861d", MUTE = "#7a6154";
const serif = (sz, wt = 700) => `${wt} ${sz}px "Noto Serif SC","Songti SC",serif`;
const sans = (sz, wt = 400) => `${wt} ${sz}px "Noto Sans SC","PingFang SC",sans-serif`;

function wrap(ctx, text, maxW) {
  const lines = []; let cur = "";
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ch; }
    else cur += ch;
  }
  if (cur) lines.push(cur);
  return lines;
}

function frame(x, H, title) {
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, CREAM); g.addColorStop(1, "#eee1c6");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(59,15,26,.16)"; x.lineWidth = 2;
  x.strokeRect(34, 34, W - 68, H - 68);
  x.textAlign = "center";
  let y = 150;
  x.strokeStyle = RED; x.lineWidth = 4; x.lineCap = "round";
  x.beginPath(); x.moveTo(W / 2 - 130, y - 30);
  x.bezierCurveTo(W / 2 - 40, y + 30, W / 2 + 40, y - 60, W / 2 + 130, y - 10);
  x.stroke();
  x.fillStyle = GOLD; x.beginPath(); x.arc(W / 2 + 130, y - 10, 8, 0, 7); x.fill();
  y += 62;
  x.fillStyle = RED; x.font = sans(24, 500);
  x.fillText(title, W / 2, y);
  return y;
}

function rule(x, label, y, bw) {
  x.textAlign = "left";
  x.fillStyle = "#9a8574"; x.font = sans(22, 600);
  x.fillText(label, PAD, y);
  x.fillStyle = "rgba(59,15,26,.14)"; x.fillRect(PAD, y + 22, bw, 2);
}

function footer(x, H, line) {
  const bw = W - PAD * 2;
  x.textAlign = "center";
  x.fillStyle = "rgba(59,15,26,.2)"; x.fillRect(PAD, H - 148, bw, 2);
  x.fillStyle = MUTE; x.font = sans(26, 500); x.fillText(line, W / 2, H - 96);
  x.fillStyle = GOLD; x.font = sans(24, 700);
  x.fillText("点链接，测你自己的", W / 2, H - 56);
}

function save(canvas, name) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `${name}.png`;
  a.click();
}

async function ready() {
  if (document.fonts?.ready) { try { await document.fonts.ready; } catch (e) {} }
}

/* ---------- 人格版（XP / 左位XP） ---------- */
export async function posterProfile({ meta, axes, code, type, pcts, top3, allyName, clashName }) {
  await ready();
  const c = document.createElement("canvas");
  const H = 1720; c.width = W; c.height = H;
  const x = c.getContext("2d");
  let y = frame(x, H, meta.eyebrow.replace(/ /g, " "));

  y += 66;
  x.fillStyle = GOLD; x.font = serif(32);
  x.fillText(code.split("").join("  ·  "), W / 2, y);

  y += 92;
  x.fillStyle = INK; x.font = serif(76, 900);
  x.fillText(type.name, W / 2, y);

  y += 62;
  x.font = sans(24, 600);
  const rTxt = `全站只有 ${type.rarity}% 的人是${type.name}`;
  const rw = x.measureText(rTxt).width + 52;
  x.fillStyle = "rgba(181,32,47,.09)";
  x.beginPath(); x.roundRect(W / 2 - rw / 2, y - 30, rw, 50, 25); x.fill();
  x.strokeStyle = "rgba(181,32,47,.28)"; x.lineWidth = 2; x.stroke();
  x.fillStyle = RED; x.fillText(rTxt, W / 2, y + 3);

  y += 92;
  x.fillStyle = INK; x.font = serif(38, 600);
  wrap(x, `“${type.verdict}”`, W - PAD * 2 - 40).forEach((ln) => { x.fillText(ln, W / 2, y); y += 58; });

  y += 34;
  const bw = W - PAD * 2;
  rule(x, "倾 向 图", y, bw); y += 66;
  axes.forEach((ax, i) => {
    const p = pcts[i], dom = p >= 50;
    x.font = sans(24, dom ? 400 : 700); x.fillStyle = dom ? "#9a8574" : RED;
    x.textAlign = "left"; x.fillText(`${ax.negLabel} ${100 - p}%`, PAD, y);
    x.font = sans(24, dom ? 700 : 400); x.fillStyle = dom ? RED : "#9a8574";
    x.textAlign = "right"; x.fillText(`${p}% ${ax.posLabel}`, W - PAD, y);
    x.textAlign = "center"; x.font = serif(22, 400); x.fillStyle = "#9a8574";
    x.fillText(ax.name, W / 2, y);
    y += 22;
    x.fillStyle = "rgba(59,15,26,.1)";
    x.beginPath(); x.roundRect(PAD, y, bw, 14, 7); x.fill();
    const bg = x.createLinearGradient(PAD, 0, PAD + bw, 0);
    bg.addColorStop(0, "#c9a227"); bg.addColorStop(1, RED);
    x.fillStyle = bg;
    x.beginPath(); x.roundRect(PAD, y, Math.max(14, bw * p / 100), 14, 7); x.fill();
    x.fillStyle = "rgba(59,15,26,.3)"; x.fillRect(W / 2 - 1, y - 5, 2, 24);
    y += 58;
  });

  y += 14;
  rule(x, "你 的 本 命", y, bw); y += 62;
  top3.forEach((t, i) => {
    x.textAlign = "left";
    x.fillStyle = GOLD; x.font = serif(24); x.fillText(String(i + 1).padStart(2, "0"), PAD, y);
    x.fillStyle = INK; x.font = serif(36); x.fillText(t.name, PAD + 54, y);
    x.fillStyle = MUTE; x.font = sans(23, 300);
    x.fillText(wrap(x, t.desc, bw - 60)[0], PAD + 54, y + 38);
    y += 88;
  });

  y += 6;
  rule(x, "C P 配 对", y, bw); y += 62;
  const pill = (label, name, bgc) => {
    x.font = sans(22, 600);
    const pw = x.measureText(label).width + 32;
    x.fillStyle = bgc; x.beginPath(); x.roundRect(PAD, y - 26, pw, 40, 8); x.fill();
    x.fillStyle = "#fffaf0"; x.textAlign = "left"; x.fillText(label, PAD + 16, y + 1);
    x.fillStyle = INK; x.font = serif(34); x.fillText(name, PAD + pw + 20, y + 2);
    y += 72;
  };
  pill("能聊到天亮", allyName, RED);
  pill("最好别开同一辆车", clashName, INK);

  footer(x, H, `${meta.title} · 四维定位`);
  save(c, `${meta.title}_${type.name}`);
}

/* ---------- 锦标赛版 ---------- */
export async function posterTournament({ meta, gold, silver, semi, quarter }) {
  await ready();
  const c = document.createElement("canvas");
  const H = 1560; c.width = W; c.height = H;
  const x = c.getContext("2d");
  let y = frame(x, H, meta.eyebrow);
  const bw = W - PAD * 2;

  y += 70;
  x.textAlign = "center";
  x.fillStyle = GOLD; x.font = sans(24, 600);
  x.fillText("冠 军", W / 2, y);

  y += 96;
  x.fillStyle = INK; x.font = serif(84, 900);
  x.fillText(gold.name, W / 2, y);

  y += 52;
  x.fillStyle = MUTE; x.font = sans(26, 300);
  wrap(x, gold.desc, bw - 60).forEach((ln) => { x.fillText(ln, W / 2, y); y += 40; });

  y += 46;
  x.fillStyle = "rgba(59,15,26,.16)"; x.fillRect(W / 2 - 60, y, 120, 2);

  y += 76;
  x.fillStyle = "#9a8574"; x.font = sans(23, 600);
  x.fillText("决赛败者", W / 2, y);
  y += 52;
  x.fillStyle = INK; x.font = serif(42);
  x.fillText(silver.name, W / 2, y);

  y += 78;
  rule(x, "四 强", y, bw); y += 66;
  y = chips(x, semi.map((s) => s.name), y, bw, 30);

  y += 26;
  rule(x, "八 强", y, bw); y += 62;
  y = chips(x, quarter.map((s) => s.name), y, bw, 26);

  footer(x, H, `${meta.title} · 63 场淘汰`);
  save(c, `${meta.title}_${gold.name}`);
}

function chips(x, names, y, bw, fontSize) {
  x.textAlign = "left";
  let cx = PAD;
  names.forEach((n) => {
    x.font = serif(fontSize, 600);
    const w = x.measureText(n).width + 40;
    if (cx + w > PAD + bw) { cx = PAD; y += fontSize + 34; }
    x.fillStyle = "#fffaf0";
    x.beginPath(); x.roundRect(cx, y - fontSize - 4, w, fontSize + 28, 999); x.fill();
    x.strokeStyle = "rgba(59,15,26,.15)"; x.lineWidth = 2; x.stroke();
    x.fillStyle = INK; x.fillText(n, cx + 20, y + 8);
    cx += w + 12;
  });
  return y + fontSize + 40;
}
