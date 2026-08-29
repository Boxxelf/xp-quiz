/* 通用赛制引擎：单淘汰 + 轮空 + 可撤销 */
export class Bracket {
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
    this.podium = null;   // 单组赛（锦标赛）用：{gold, silver, semi[], quarter[]}
    this._settle();
  }
  _snapshot() {
    return { gi: this.gi, round: this.round.slice(), roundNo: this.roundNo,
      next: this.next.slice(), pos: this.pos, champions: this.champions.slice(),
      logLen: this.log.length, done: this.done };
  }
  _restore(s) {
    this.gi = s.gi; this.round = s.round.slice(); this.roundNo = s.roundNo;
    this.next = s.next.slice(); this.pos = s.pos; this.champions = s.champions.slice();
    this.log.length = s.logLen; this.done = s.done;
  }
  _settle() {
    for (;;) {
      if (this.pos >= this.round.length) {
        if (this.next.length === 1) {
          this.champions.push(this.next[0]);
          this.gi += 1;
          if (this.gi >= this.groups.length) return;
          this.round = this.groups[this.gi].slice();
          this.roundNo = 0; this.next = []; this.pos = 0;
          continue;
        }
        this.round = this.next; this.roundNo += 1; this.next = []; this.pos = 0;
        continue;
      }
      if (this.pos === this.round.length - 1) {
        this.next.push(this.round[this.pos]); this.pos += 1; continue;
      }
      return;
    }
  }
  finished() { return this.gi >= this.groups.length; }
  match() { return this.finished() ? null : [this.round[this.pos], this.round[this.pos + 1]]; }
  /** 当前这一轮还剩多少人（锦标赛用来显示 32 强 / 16 强） */
  roundSize() { return this.finished() ? 0 : this.round.length; }
  canUndo() { return this.history.length > 0; }
  undo() { if (!this.canUndo()) return false; this._restore(this.history.pop()); return true; }
  pick(i) {
    const [a, b] = this.match();
    this.history.push(this._snapshot());
    const w = i === 0 ? a : b, l = i === 0 ? b : a;
    this.log.push({ winner: w, loser: l, weight: 1 + this.roundNo * 0.6, size: this.round.length });
    this.next.push(w); this.pos += 2; this.done += 1;
    this._settle();
  }
}

export const totalMatches = (groups) => groups.reduce((s, g) => s + (g.length - 1), 0);

/* 四维计分：只看「赢的比输的多偏向哪一极」，抵消词库本身的倾斜 */
export function score(log) {
  const raw = [0, 0, 0, 0], max = [0, 0, 0, 0];
  log.forEach(({ winner, loser, weight }) => {
    for (let k = 0; k < 4; k++) {
      const d = winner.a[k] - loser.a[k];
      raw[k] += d * weight; max[k] += Math.abs(d) * weight;
    }
  });
  return raw.map((v, k) =>
    Math.round((Math.max(-1, Math.min(1, v / (max[k] || 1))) + 1) * 50));
}

export const codeOf = (pcts, axes) =>
  axes.map((ax, i) => (pcts[i] >= 50 ? ax.pos : ax.neg)).join("");

function flipAt(code, idx, axes) {
  const c = code.split("");
  c[idx] = c[idx] === axes[idx].pos ? axes[idx].neg : axes[idx].pos;
  return c.join("");
}

export function pairing(code, pcts, axes) {
  const dist = pcts.map((p) => Math.abs(p - 50));
  const softest = dist.indexOf(Math.min(...dist));
  const ally = flipAt(code, softest, axes);
  let clash = code;
  for (let i = 0; i < 4; i++) clash = flipAt(clash, i, axes);
  return { ally, clash, softest };
}

/* 锦标赛名次：从对战记录里还原冠亚军与四强、八强 */
export function podium(log) {
  const at = (n) => log.filter((m) => m.size === n);
  const final = at(2)[0];
  const semis = at(4);
  const quarters = at(8);
  return {
    gold: final ? final.winner : null,
    silver: final ? final.loser : null,
    semi: semis.map((m) => m.loser),
    quarter: quarters.map((m) => m.loser),
  };
}
