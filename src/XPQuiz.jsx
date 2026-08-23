import React, { useState, useRef, useCallback, useEffect } from "react";

/* ============================================================
   词条数据
   axes: [结局 圆(+)/缺(-), 张力 战(+)/依(-), 权势 悬(+)/平(-), 越界 破(+)/守(-)]
   ============================================================ */
const T = (name, desc, a) => ({ name, desc, a });

const GROUPS = [
  [
    T("恨海情天", "恨是爱的续命方式，不恨就没有下文了", [-2, 2, 0, 1]),
    T("破镜重圆", "拼回去了，但每次抱都硌手", [2, 0, 0, 0]),
    T("镜花水月", "ta从没属于过你，你也从没承认过", [-2, -1, 1, 0]),
    T("枯木逢春", "心死过一次的人，复活时最不要命", [2, 0, 0, 0]),
  ],
  [
    T("烂人真心", "ta把全世界都骗了，唯独没骗你，这就够你死一次", [0, 1, 0, 2]),
    T("圣人私心", "ta普度众生，却在你这里破了戒", [0, 0, 1, 2]),
  ],
  [
    T("明月高悬", "你可以看一辈子，但月亮不会低头", [-1, -1, 2, -1]),
    T("欢喜冤家", "吵得越凶，越证明谁都舍不得走", [2, 2, 0, 0]),
  ],
  [
    T("宿敌变挚友", "刀放下的那一刻，比刀举起来时更危险", [1, 2, 0, 0]),
    T("挚友变宿敌", "最懂你的人，下手最准", [-2, 2, 0, 0]),
    T("宿敌", "只有ta值得你恨这么多年", [-1, 2, 0, 1]),
    T("挚友", "不必说破，说破就没了", [1, -2, -1, -1]),
  ],
  [
    T("相爱相杀", "刀已经递出去，手还是抖了一下", [-1, 2, 0, 1]),
    T("师徒", "ta教你所有本事，唯独没教你怎么不喜欢ta", [0, 0, 2, 1]),
  ],
  [
    T("骨科", "血缘之内，没有退路的那种设定", [0, 0, 0, 2]),
    T("伪骨科", "名分上是一家人，身体里没有一滴共同的血", [1, 0, 0, 1]),
  ],
  [
    T("爱而不得", "从头到尾只差一步，而这一步永远差着", [-2, 0, 0, 0]),
    T("先婚后爱", "先签的字，后动的心，顺序错了但结果对了", [2, 0, 0, -1]),
    T("强制爱", "一方步步紧逼，另一方从未点头的关系", [0, 1, 2, 2]),
    T("默默守护", "ta站了很多年，你一次都没回头", [-1, -2, 0, -1]),
  ],
  [
    T("青梅竹马", "认识太早，反而错过了说出口的时机", [1, -1, -2, -1]),
    T("天降", "半路闯进来的人，一击命中", [1, 1, 0, 0]),
  ],
  [
    T("年上", "ta知道你要什么，在你开口之前", [0, -1, 1, 0]),
    T("年下", "ta什么都不懂，但ta敢", [0, 1, -1, 1]),
  ],
  [
    T("救赎", "把人从泥里拽出来，自己也沾了一身", [2, 0, 1, -1]),
    T("一起腐烂", "谁也不救谁，那就一起沉", [-2, 0, -1, 2]),
  ],
  [
    T("暗恋", "说出口就输了，所以宁可一直输着", [-1, -2, 0, -1]),
    T("明恋", "喜欢就喊出来，不怕全世界听见", [1, 1, 0, -1]),
  ],
  [
    T("双强", "势均力敌，谁也不必让，谁也不肯输", [1, 2, -2, 0]),
    T("霸总娇妻", "一个说了算，一个愿意让ta说了算", [1, -1, 2, 0]),
    T("追妻火葬场", "早干嘛去了", [1, 1, 0, 0]),
    T("追夫火葬场", "这回轮到追的那个人后悔得睡不着", [1, 1, 0, 0]),
  ],
  [
    T("老夫老妻", "话说一半就够，剩下那半对方早知道", [2, -2, -1, -1]),
    T("对抗路", "立场天生对立，偏偏没忍住", [-1, 2, 0, 1]),
    T("露水姻缘", "只有那一夜，天亮之后各自不认", [-2, 0, 0, 2]),
    T("白头偕老", "什么都没发生，却一起过完了一辈子", [2, -2, -1, -2]),
    T("日久生情", "每天多一点，某个平常的下午忽然全明白", [2, -1, -1, -1]),
    T("一见钟情", "第一眼，判决就下来了", [1, 1, 0, 0]),
  ],
  [
    T("君臣", "ta跪着，心里想的却是抬头看你", [-1, 1, 2, 1]),
    T("主仆", "身份隔着一道墙，墙上早有洞", [0, -1, 2, 1]),
  ],
  [
    T("前世今生", "这辈子的重逢，是上辈子欠的债", [1, 0, 0, 1]),
    T("错位时空", "同一个世界，永远错开半步", [-2, 0, 0, 0]),
    T("兰因絮果", "开头美得像兰花，结局散得像飞絮", [-2, 0, 0, 0]),
    T("莞莞类卿", "ta爱的从来不是你，是你像的那个人", [-2, -1, 1, 1]),
  ],
  [
    T("明媒正娶", "堂堂正正站在ta身边，谁都不能说什么", [2, 0, 0, -2]),
    T("地下情", "见不得光，但比什么都真", [-1, 0, 0, 2]),
  ],
];

const TOTAL_MATCHES = GROUPS.reduce((s, g) => s + (g.length - 1), 0);

/* ============================================================
   四维定义
   ============================================================ */
const AXES = [
  { key: 0, pos: "圆", neg: "缺", posLabel: "圆满", negLabel: "遗憾", name: "结局" },
  { key: 1, pos: "战", neg: "依", posLabel: "对峙", negLabel: "依偎", name: "张力" },
  { key: 2, pos: "悬", neg: "平", posLabel: "悬殊", negLabel: "对等", name: "权势" },
  { key: 3, pos: "破", neg: "守", posLabel: "越界", negLabel: "守界", name: "越界" },
];

/* ============================================================
   16 型人格
   ============================================================ */
const TYPES = {
  "圆战悬破": { name: "驯神者", verdict: "你不要爱情，你要的是ta跪下来的那一秒。", weak: "平等相待的健康关系，你会觉得没在演。", rarity: 6.4 },
  "圆战悬守": { name: "明媒正娶激进派", verdict: "先打一架，打完领证，证得当着所有人的面领。", weak: "地下情。见不得光的你一天都忍不了。", rarity: 4.0 },
  "圆战平破": { name: "双强互殴福报户", verdict: "势均力敌才配得上你，顺便把规矩一起踩了。", weak: "一方全程让着另一方，你出戏出到关平板。", rarity: 5.3 },
  "圆战平守": { name: "过命交情原教旨", verdict: "先做生死之交，再做别的，顺序错了不谈。", weak: "一见钟情。你觉得那不叫爱，那叫上头。", rarity: 7.9 },
  "圆依悬破": { name: "金丝雀主理人", verdict: "ta把你养在笼子里，而你早就配好了钥匙。", weak: "双强对峙，你嫌累，你只想被人接住。", rarity: 3.0 },
  "圆依悬守": { name: "正宫命", verdict: "身份差多少无所谓，名分必须一个不缺。", weak: "开放式结局。你要看到ta们老了那一幕。", rarity: 10.1 },
  "圆依平破": { name: "竹马禁忌爱好者", verdict: "从小认识，长大越界，越的还是那种最麻烦的界。", weak: "天降。你无法接受十八岁才出场的人赢过十八年。", rarity: 1.9 },
  "圆依平守": { name: "HE底线党", verdict: "虐可以，刀可以，但最后一页必须是ta们在一起。", weak: "BE。你会连夜找同人文补一个好结局。", rarity: 13.9 },
  "缺战悬破": { name: "刀尖信徒", verdict: "你不吃糖，你吃刀，而且要沾着血的那把。", weak: "甜文。三章之内你就开始怀疑作者要搞事。", rarity: 13.9 },
  "缺战悬守": { name: "忠臣殉道者", verdict: "ta坐在高处，你连恨都得规规矩矩地恨。", weak: "强制爱。你觉得那玷污了这份克制的美感。", rarity: 2.0 },
  "缺战平破": { name: "同归于尽爱好者", verdict: "救什么救，一起烂在这儿才是结局。", weak: "救赎。你觉得那是懦弱者的退路。", rarity: 9.8 },
  "缺战平守": { name: "遗憾收藏家", verdict: "两个都很好，两个都没做错，所以更没救了。", weak: "强扭的甜。你宁可ta们体面地错过。", rarity: 2.8 },
  "缺依悬破": { name: "月亮观测员", verdict: "ta在天上，你在泥里，而你从不打算爬上去。", weak: "双向奔赴。ta一低头，你的美学就塌了。", rarity: 6.5 },
  "缺依悬守": { name: "默默守护晚期", verdict: "你站了十年，ta回过一次头，你觉得赚了。", weak: "告白。说出口那一刻，故事对你就结束了。", rarity: 4.8 },
  "缺依平破": { name: "莞莞类卿本卿", verdict: "ta抱着你，喊的是别人的名字，你还不肯松手。", weak: "被人堂堂正正地爱。你会不适应到想跑。", rarity: 2.8 },
  "缺依平守": { name: "白月光守墓人", verdict: "什么都没发生，所以什么都没坏，这就是你要的。", weak: "破镜重圆。碎了就该碎着，拼回去多丑。", rarity: 4.7 },
};

/* ============================================================
   赛制引擎
   ============================================================ */
class Bracket {
  constructor(groups) {
    this.groups = groups;
    this.gi = 0;
    this.round = groups[0].slice();
    this.roundNo = 0;
    this.next = [];
    this.pos = 0;
    this.champions = [];
    this.log = [];
    this.done = 0;
    this.history = [];
    this._settle();
  }
  _snapshot() {
    return {
      gi: this.gi,
      round: this.round.slice(),
      roundNo: this.roundNo,
      next: this.next.slice(),
      pos: this.pos,
      champions: this.champions.slice(),
      logLen: this.log.length,
      done: this.done,
    };
  }
  _restore(s) {
    this.gi = s.gi;
    this.round = s.round.slice();
    this.roundNo = s.roundNo;
    this.next = s.next.slice();
    this.pos = s.pos;
    this.champions = s.champions.slice();
    this.log.length = s.logLen;
    this.done = s.done;
  }
  _settle() {
    for (;;) {
      if (this.pos >= this.round.length) {
        if (this.next.length === 1) {
          this.champions.push(this.next[0]);
          this.gi += 1;
          if (this.gi >= this.groups.length) return;
          this.round = this.groups[this.gi].slice();
          this.roundNo = 0;
          this.next = [];
          this.pos = 0;
          continue;
        }
        this.round = this.next;
        this.roundNo += 1;
        this.next = [];
        this.pos = 0;
        continue;
      }
      if (this.pos === this.round.length - 1) {
        this.next.push(this.round[this.pos]);
        this.pos += 1;
        continue;
      }
      return;
    }
  }
  finished() { return this.gi >= this.groups.length; }
  match() { return this.finished() ? null : [this.round[this.pos], this.round[this.pos + 1]]; }
  canUndo() { return this.history.length > 0; }
  undo() {
    if (!this.canUndo()) return false;
    this._restore(this.history.pop());
    return true;
  }
  pick(i) {
    const [a, b] = this.match();
    this.history.push(this._snapshot());
    const w = i === 0 ? a : b;
    const l = i === 0 ? b : a;
    this.log.push({ winner: w, loser: l, weight: 1 + this.roundNo * 0.6 });
    this.next.push(w);
    this.pos += 2;
    this.done += 1;
    this._settle();
  }
}

/* ============================================================
   计分：每一次抉择都算分，越靠后的回合权重越高
   ============================================================ */
function score(log) {
  // 只看「赢的比输的多偏向哪一极」，避免词库本身的倾斜污染结果
  const raw = [0, 0, 0, 0];
  const max = [0, 0, 0, 0];
  log.forEach(({ winner, loser, weight }) => {
    for (let k = 0; k < 4; k++) {
      const d = winner.a[k] - loser.a[k];
      raw[k] += d * weight;
      max[k] += Math.abs(d) * weight;
    }
  });
  return raw.map((v, k) => {
    const norm = Math.max(-1, Math.min(1, v / (max[k] || 1)));
    return Math.round((norm + 1) * 50); // 0..100，100 = 正极
  });
}

function codeOf(pcts) {
  return AXES.map((ax, i) => (pcts[i] >= 50 ? ax.pos : ax.neg)).join("");
}

function flipAt(code, idx) {
  const chars = code.split("");
  const ax = AXES[idx];
  chars[idx] = chars[idx] === ax.pos ? ax.neg : ax.pos;
  return chars.join("");
}

function matches(code, pcts) {
  // 最合拍：翻转你态度最摇摆的那一维（你不在意，所以能互补）
  const dist = pcts.map((p) => Math.abs(p - 50));
  const softest = dist.indexOf(Math.min(...dist));
  const ally = flipAt(code, softest);
  // 相冲：四维全反
  let clash = code;
  for (let i = 0; i < 4; i++) clash = flipAt(clash, i);
  return { ally, clash, softest };
}

/* ============================================================
   分享图导出：用 canvas 直接画一张竖版海报
   ============================================================ */
const W = 1080, PAD = 88;
const CREAM = "#f5eddd", INK = "#3b0f1a", RED = "#b5202f", GOLD = "#a8861d", MUTE = "#7a6154";
const serif = (sz, wt = 700) => `${wt} ${sz}px "Noto Serif SC", "Songti SC", serif`;
const sans = (sz, wt = 400) => `${wt} ${sz}px "Noto Sans SC", "PingFang SC", sans-serif`;

function wrap(ctx, text, maxW) {
  const lines = [];
  let cur = "";
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ch; }
    else cur += ch;
  }
  if (cur) lines.push(cur);
  return lines;
}

async function exportPoster({ code, type, pcts, top3, ally, clash }) {
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  const c = document.createElement("canvas");
  const H = 1720;
  c.width = W; c.height = H;
  const x = c.getContext("2d");

  // 背景
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, CREAM); g.addColorStop(1, "#eee1c6");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(59,15,26,.16)"; x.lineWidth = 2;
  x.strokeRect(34, 34, W - 68, H - 68);

  let y = 150;
  x.textAlign = "center";

  // 红线
  x.strokeStyle = RED; x.lineWidth = 4; x.lineCap = "round";
  x.beginPath(); x.moveTo(W / 2 - 130, y - 30);
  x.bezierCurveTo(W / 2 - 40, y + 30, W / 2 + 40, y - 60, W / 2 + 130, y - 10);
  x.stroke();
  x.fillStyle = GOLD; x.beginPath(); x.arc(W / 2 + 130, y - 10, 8, 0, 7); x.fill();

  y += 62;
  x.fillStyle = RED; x.font = sans(24, 500);
  x.fillText("同 人 女 · X P 人 格", W / 2, y);

  y += 66;
  x.fillStyle = GOLD; x.font = serif(32);
  x.fillText(code.split("").join("  ·  "), W / 2, y);

  y += 92;
  x.fillStyle = INK; x.font = serif(76, 900);
  x.fillText(type.name, W / 2, y);

  // 稀有度胶囊
  y += 62;
  x.font = sans(24, 600);
  const rTxt = `全站只有 ${type.rarity}% 的人是${type.name}`;
  const rw = x.measureText(rTxt).width + 52;
  x.fillStyle = "rgba(181,32,47,.09)";
  x.beginPath(); x.roundRect(W / 2 - rw / 2, y - 30, rw, 50, 25); x.fill();
  x.strokeStyle = "rgba(181,32,47,.28)"; x.lineWidth = 2; x.stroke();
  x.fillStyle = RED; x.fillText(rTxt, W / 2, y + 3);

  // 判词
  y += 92;
  x.fillStyle = INK; x.font = serif(38, 600);
  wrap(x, `“${type.verdict}”`, W - PAD * 2 - 40).forEach((ln) => { x.fillText(ln, W / 2, y); y += 58; });

  // 倾向图
  y += 34;
  x.textAlign = "left";
  const bw = W - PAD * 2;
  sectionRule(x, "倾 向 图", y, bw); y += 66;
  AXES.forEach((ax, i) => {
    const p = pcts[i], dom = p >= 50;
    x.font = sans(24, dom ? 400 : 700);
    x.fillStyle = dom ? "#9a8574" : RED;
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

  // 本命
  y += 14;
  sectionRule(x, "你 的 本 命", y, bw); y += 62;
  top3.forEach((t, i) => {
    x.textAlign = "left";
    x.fillStyle = GOLD; x.font = serif(24);
    x.fillText(String(i + 1).padStart(2, "0"), PAD, y);
    x.fillStyle = INK; x.font = serif(36);
    x.fillText(t.name, PAD + 54, y);
    x.fillStyle = MUTE; x.font = sans(23, 300);
    x.fillText(wrap(x, t.desc, bw - 60)[0], PAD + 54, y + 38);
    y += 88;
  });

  // 配对
  y += 6;
  sectionRule(x, "C P 配 对", y, bw); y += 62;
  const pill = (label, name, bgc) => {
    x.font = sans(22, 600);
    const pw = x.measureText(label).width + 32;
    x.fillStyle = bgc;
    x.beginPath(); x.roundRect(PAD, y - 26, pw, 40, 8); x.fill();
    x.fillStyle = "#fffaf0"; x.textAlign = "left";
    x.fillText(label, PAD + 16, y + 1);
    x.fillStyle = INK; x.font = serif(34);
    x.fillText(name, PAD + pw + 20, y + 2);
    y += 72;
  };
  pill("能聊到天亮", TYPES[ally].name, RED);
  pill("最好别开同一辆车", TYPES[clash].name, INK);

  // 页脚
  x.textAlign = "center";
  x.fillStyle = "rgba(59,15,26,.2)"; x.fillRect(PAD, H - 148, bw, 2);
  x.fillStyle = MUTE; x.font = sans(26, 500);
  x.fillText("XP 二选一 · 30 回合抉择，四维定位", W / 2, H - 96);
  x.fillStyle = GOLD; x.font = sans(24, 700);
  x.fillText("扫码 / 点链接，测你自己的", W / 2, H - 56);

  const url = c.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url; a.download = `XP人格_${type.name}.png`;
  a.click();
}

function sectionRule(x, label, y, bw) {
  x.textAlign = "left";
  x.fillStyle = "#9a8574"; x.font = sans(22, 600);
  x.fillText(label, PAD, y);
  x.fillStyle = "rgba(59,15,26,.14)";
  x.fillRect(PAD, y + 22, bw, 2);
}

/* ============================================================
   组件
   ============================================================ */
export default function XPQuiz() {
  const [stage, setStage] = useState("intro");
  const b = useRef(null);
  const [, tick] = useState(0);
  const [fx, setFx] = useState(null);      // 正在结算的那一次抉择
  const [dir, setDir] = useState("fwd");   // 新卡组从下方还是上方进场

  const start = () => { b.current = new Bracket(GROUPS); setDir("fwd"); setStage("quiz"); };

  const pick = useCallback((i) => {
    if (fx !== null) return;               // 结算期间锁住输入，连点不会跳题
    buzz(8);
    setFx(i);
    setDir("fwd");
    setTimeout(() => {
      b.current.pick(i);
      setFx(null);
      if (b.current.finished()) setStage("result");
      else tick((t) => t + 1);
    }, 440);
  }, [fx]);

  const back = useCallback(() => {
    if (fx !== null || !b.current?.canUndo()) return;
    buzz(5);
    b.current.undo();
    setDir("back");
    tick((t) => t + 1);
  }, [fx]);

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      {stage === "intro" && <Intro onStart={start} />}
      {stage === "quiz" && b.current && (
        <Quiz
          m={b.current.match()}
          done={b.current.done}
          group={b.current.gi}
          fx={fx}
          dir={dir}
          canBack={b.current.canUndo()}
          onPick={pick}
          onBack={back}
        />
      )}
      {stage === "result" && (
        <Result b={b.current} onRestart={() => { b.current = null; setStage("intro"); }} />
      )}
    </div>
  );
}

const CSS = `
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
@keyframes cardOut {
  0% { transform: none; }
  100% { opacity:0; transform: translateY(20px) scale(.93) rotate(-2deg); }
}
@keyframes stampIn { from { opacity:0; transform: rotate(-14deg) scale(1.6); } to { opacity:.88; transform: rotate(-14deg) scale(1); } }
@keyframes drawThread { from { stroke-dashoffset: 190; } to { stroke-dashoffset: 0; } }
@keyframes vsPulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }

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

.tap:active { transform: scale(.975) !important; transition: transform .07s ease !important; }
.ghost-tap:active { background: rgba(59,15,26,.06) !important; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-delay: 0ms !important; transition-duration: .01ms !important; }
}
`;

const buzz = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (e) {} };

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

function Intro({ onStart }) {
  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center" }}>
        <Thread />
        <div style={S.eyebrow}>同人女 · 人格采样</div>
        <h1 style={S.h1}>XP 二选一</h1>
        <p style={S.sub}>
          {TOTAL_MATCHES} 回合抉择，四维定位<br />
          最后给你一个躲不掉的判词
        </p>
        <div style={S.panel}>
          <p style={S.panelText}>
            两个词，选更上头的那个。<br />
            选不出来就凭直觉，犹豫越久越不准。
          </p>
        </div>
        <button className="tap" style={S.btnPrimary} onClick={onStart}>开始测试</button>
      </div>
    </div>
  );
}

function Quiz({ m, done, group, fx, dir, canBack, onPick, onBack }) {
  const pct = Math.round((done / TOTAL_MATCHES) * 100);
  const resolving = fx !== null;
  // key 变化时进场动画重播；结算期间 key 不变，播的是退场动画
  const enterA = dir === "back" ? "back-a" : "pair-a";
  const enterB = dir === "back" ? "back-b" : "pair-b";

  return (
    <div style={S.screen}>
      <div style={{ marginBottom: 8 }}>
        <div style={S.progLabel}>
          <span>第 {done + 1} / {TOTAL_MATCHES} 回合</span>
          <span style={{ color: "#a8861d" }}>{pct}%</span>
        </div>
        <div style={S.progTrack}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>
        <div style={S.progSub}>
          <button
            className="ghost-tap"
            style={{ ...S.backBtn, opacity: canBack && !resolving ? 1 : 0.28, cursor: canBack && !resolving ? "pointer" : "default" }}
            onClick={onBack}
            disabled={!canBack || resolving}
            aria-label="返回上一题"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一题
          </button>
          <span style={S.groupTag}>第 {group + 1} / {GROUPS.length} 组</span>
        </div>
      </div>

      <div key={done} style={S.matchArea}>
        <Card
          t={m[0]}
          onClick={() => onPick(0)}
          anim={resolving ? (fx === 0 ? "win" : "out") : enterA}
          out={fx === 1}
          locked={resolving}
        />
        <div className="vs" style={S.vs}>VS</div>
        <Card
          t={m[1]}
          onClick={() => onPick(1)}
          anim={resolving ? (fx === 1 ? "win" : "out") : enterB}
          out={fx === 0}
          locked={resolving}
        />
      </div>
      <p style={S.hint}>点击你更心动的那一个</p>
    </div>
  );
}

function Card({ t, onClick, anim, out, locked }) {
  return (
    <button
      className={`${anim} ${locked ? "" : "tap"}`}
      onClick={onClick}
      disabled={locked}
      style={S.card}
    >
      <span style={S.cardName}>{t.name}</span>
      <span style={S.cardDesc}>{t.desc}</span>
      {out && <span className="stamp" style={S.stamp}>出局</span>}
    </button>
  );
}

function Result({ b, onRestart }) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");
  const pcts = score(b.log);
  const code = codeOf(pcts);
  const type = TYPES[code];
  const { ally, clash, softest } = matches(code, pcts);

  // 本命 = 最贴合你四维画像的三个组冠军
  const dir = pcts.map((p) => (p - 50) / 50);
  const top3 = [...b.champions]
    .map((c) => ({ c, s: c.a.reduce((sum, v, k) => sum + v * dir[k], 0) }))
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map((x) => x.c);

  const copy = () => {
    const txt = `我的同人女XP人格：${code} 「${type.name}」\n${type.verdict}\n全站占比 ${type.rarity}%\n本命：${top3.map((t) => t.name).join(" / ")}`;
    navigator.clipboard?.writeText(txt)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })
      .catch(() => setErr("复制失败，长按上面的文字手动选中"));
  };

  return (
    <div style={S.screen} className="rise">
      <div style={{ textAlign: "center" }}>
        <Thread />
        <div style={S.eyebrow}>你的 XP 人格</div>
        <div style={S.code}>{code.split("").join(" · ")}</div>
        <h1 style={{ ...S.h1, fontSize: 34, margin: "4px 0 10px" }}>{type.name}</h1>
        <div style={S.rarity}>全站只有 {type.rarity}% 的人是{type.name}</div>
        <div style={S.verdict}>“{type.verdict}”</div>
      </div>

      <Section label="倾向图">
        {AXES.map((ax, i) => <Bar key={i} ax={ax} pct={pcts[i]} delay={i * 110} />)}
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

      <Section label="你的雷点">
        <p style={S.plain}>{type.weak}</p>
      </Section>

      <Section label="CP 配对">
        <div style={S.pairRow}>
          <span style={S.pairTag}>能聊到天亮</span>
          <span style={S.pairName}>{TYPES[ally].name}</span>
        </div>
        <p style={S.pairNote}>你在「{AXES[softest].name}」这一维最松动，正好接得住ta。</p>
        <div style={{ ...S.pairRow, marginTop: 14 }}>
          <span style={{ ...S.pairTag, background: "#3b0f1a" }}>最好别开同一辆车</span>
          <span style={S.pairName}>{TYPES[clash].name}</span>
        </div>
        <p style={S.pairNote}>四维全反，你们连吵架都吵不到一个点上。</p>
      </Section>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
        <button
          className="tap"
          style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }}
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try { await exportPoster({ code, type, pcts, top3, ally, clash }); }
            catch (e) { setErr("图片没能生成，换个浏览器再试一次"); }
            setSaving(false);
          }}
        >
          {saving ? "正在生成…" : "保存结果长图"}
        </button>
        <button className="tap ghost-tap" style={S.btnGhost} onClick={copy}>{copied ? "已复制" : "复制文字版"}</button>
        <button className="tap ghost-tap" style={S.btnGhost} onClick={onRestart}>再测一次</button>
        {err && <p style={{ ...S.pairNote, textAlign: "center", color: "#b5202f" }}>{err}</p>}
      </div>
    </div>
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
  const [w, setW] = useState(50); // 从中线开始，挂载后向你的实际值展开
  useEffect(() => {
    const id = setTimeout(() => setW(pct), 120 + delay);
    return () => clearTimeout(id);
  }, [pct, delay]);

  const dominant = pct >= 50;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={S.barHead}>
        <span style={{ ...S.barSide, color: !dominant ? "#b5202f" : "#9a8574", fontWeight: !dominant ? 700 : 400 }}>
          {ax.negLabel} {100 - pct}%
        </span>
        <span style={S.barAxis}>{ax.name}</span>
        <span style={{ ...S.barSide, textAlign: "right", color: dominant ? "#b5202f" : "#9a8574", fontWeight: dominant ? 700 : 400 }}>
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

/* ============================================================
   样式
   ============================================================ */
const S = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#f5eddd 0%,#eee1c6 100%)",
    fontFamily: "'Noto Sans SC',sans-serif",
    color: "#2b1a14",
    display: "flex",
    justifyContent: "center",
  },
  screen: {
    width: "100%",
    maxWidth: 460,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "36px 22px 44px",
    boxSizing: "border-box",
  },
  eyebrow: { marginTop: 14, fontSize: 12, letterSpacing: ".3em", color: "#b5202f", fontWeight: 500 },
  h1: { fontFamily: "'Noto Serif SC',serif", fontWeight: 900, fontSize: 40, margin: "8px 0 14px", color: "#3b0f1a", letterSpacing: ".04em" },
  sub: { fontSize: 14, lineHeight: 1.9, color: "#5c463c", marginBottom: 22 },
  panel: { background: "#fffaf0", border: "1px solid rgba(59,15,26,.1)", borderRadius: 14, padding: "16px 18px", marginBottom: 26, boxShadow: "0 2px 10px rgba(59,15,26,.06)" },
  panelText: { fontSize: 13.5, lineHeight: 2, color: "#4a362d", margin: 0 },
  btnPrimary: { width: "100%", padding: "15px 0", fontSize: 15.5, fontWeight: 700, letterSpacing: ".1em", color: "#fffaf0", background: "linear-gradient(180deg,#c22a3a,#9c1c2a)", border: "none", borderRadius: 999, boxShadow: "0 6px 16px rgba(154,28,42,.32)", cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { width: "100%", padding: "15px 0", fontSize: 15.5, fontWeight: 700, letterSpacing: ".1em", color: "#3b0f1a", background: "transparent", border: "1.5px solid rgba(59,15,26,.22)", borderRadius: 999, cursor: "pointer", fontFamily: "inherit" },
  credit: { marginTop: 22, fontSize: 11, color: "#8a7565", letterSpacing: ".05em" },

  progSub: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11, marginBottom: 20 },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: "none", padding: "6px 9px 6px 4px", marginLeft: -4, borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: "#8a7565", letterSpacing: ".04em", transition: "opacity .22s ease, background .15s ease" },
  groupTag: { fontFamily: "'Noto Serif SC',serif", fontSize: 11, color: "#9a8574", letterSpacing: ".14em" },
  matchArea: { display: "flex", flexDirection: "column" },
  progLabel: { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6b5648", marginBottom: 7, fontWeight: 600, letterSpacing: ".05em" },
  progTrack: { height: 3, background: "rgba(59,15,26,.12)", borderRadius: 3, overflow: "hidden" },
  progFill: { height: "100%", background: "linear-gradient(90deg,#c9a227,#b5202f)", transition: "width .35s ease" },

  card: { width: "100%", background: "#fffaf0", border: "2px solid rgba(59,15,26,.13)", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9, padding: "24px 18px", cursor: "pointer", position: "relative", transition: "border-color .2s ease, box-shadow .2s ease", boxShadow: "0 4px 14px rgba(59,15,26,.08)", fontFamily: "inherit" },
  cardName: { fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: 25, color: "#3b0f1a", letterSpacing: ".07em" },
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
};
