# XP 二选一 · 同人女人格测试

移动端网页测试合集，四条赛道共用一套赛制引擎。

| 赛道 | 词条 | 回合 | 结果形态 |
|---|---|---|---|
| 同人女 XP 二选一 | 46 | 30 | 四维人格 + 16 型 |
| 左位 XP 二选一 | 48 | 36 | 四维人格 + 16 型 |
| 同人文梗 64 强 | 64 | 63 | 锦标赛名次 |
| 同人文梗 64 强 2.0 | 64 | 63 | 锦标赛名次 |

每条赛道都支持逐题回退、结果长图导出、文字版复制。

## 本地跑起来

```bash
npm install
npm run dev      # 打开 http://localhost:5173
```

## 打包

```bash
npm run build    # 产物在 dist/
```

`dist/` 是一个纯静态文件夹，没有后端，扔到任何静态托管都能跑。

## 部署

主要受众在国内的话，用 EdgeOne Pages 或 Cloudflare Pages。
Vercel / Netlify 在国内访问不稳定，只适合做备用线路。

### EdgeOne Pages（推荐给国内流量）
1. 代码推到 GitHub
2. 腾讯云控制台 → EdgeOne → Pages → 创建项目 → 从 Git 导入
3. 构建命令 `npm run build`，输出目录 `dist`
4. 拿到 `xxx.edgeone.app` 的地址，直接就能用

用自定义域名接国内节点需要 ICP 备案；不想备案就用平台给的默认域名，
或者把加速区域选成「全球（不含中国大陆）」。

### Cloudflare Pages（无需备案，全球线路）
1. 代码推到 GitHub
2. Cloudflare → Workers & Pages → Create → 连接仓库
3. 框架预设选 Vite，构建命令 `npm run build`，输出目录 `dist`

## 目录

```
index.html          页面壳、SEO 与分享卡片 meta
src/main.jsx        挂载入口
src/XPQuiz.jsx      应用外壳：合集首页、答题页、两种结果页
src/engine.js       赛制引擎：单淘汰、轮空、撤销、计分、名次还原
src/ui.js           共用样式与动效
src/poster.js       长图导出（人格版 / 锦标赛版两种版式）
src/data-xp.js      同人女 XP：词条 + 四维 + 16 型
src/data-seat.js    左位 XP：词条 + 四维 + 16 型
src/data-tropes.js  同人文梗 1.0 / 2.0 两个 64 强赛道
```

## 加一条新赛道

在 `src/data-*.js` 里照着现有格式写一份，然后在 `XPQuiz.jsx` 的 `QUIZZES`
数组里加一项。`mode: "profile"` 出四维人格，`mode: "tournament"` 出锦标赛名次。

人格赛道的 `rarity` 是模拟出来的分布，改动词条后需要重新跑一遍随机模拟再校准，
否则百分比会失真。
