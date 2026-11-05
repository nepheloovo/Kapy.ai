# Kapy.ai Landing Page — Build Prompt

USAGE SCOPE: original product landing page for "Kapy.ai" (owned by the repository owner). https://lusion.co/ was analysed as an internal reference for layout rhythm and motion techniques only. Do NOT use the Lusion name, wordmark, copy, project names, photos, videos, 3D models, the commercial "Aeonik" font, or any file from lusion.co. Every word, image and model on this page belongs to Kapy.ai.

## BLOCK 0 — OPENING BRIEF

Build a single-page, award-style interactive product landing site for **"Kapy.ai"** — a local-first desktop game studio where a pixel capybara named Kapy and a team of AI agents turn one sentence into a reviewed, playable Web or Godot 4 game. The page has exactly 9 parts, in this order: **Loader → Header + Menu stack → Hero (WebGL voxel scene card) → Intro ("One sentence, brought to play") with a scroll-drawn ribbon → Expanding Demo Reel → The Studio (six pipeline cards) → Pick Your World (four skins, pinned horizontal rail) → Pixel World Fly-through (scroll-driven 3D parallax tunnel with kinetic type) → Let's Make a Game CTA (Kapy + floating sticker field) → Footer**. Stack: **React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + Framer Motion 11 + three.js 0.170 + Lenis 1.1 + lucide-react**. Aesthetic: calm, premium, playful — a cool paper-white page `#F1F0EB` with near-black ink `#14131A`, huge tight neo-grotesk headlines, generous whitespace, 20px-radius media cards, tiny monospace uppercase labels, "+" crosshair grid markers, and one warm yuzu-orange accent `#FF8A1F`. Pixel art appears only as Kapy's own sprites and small pixel accents — the page itself is sleek, not retro. Match every detail below exactly.

## BLOCK 1 — TECH STACK (already installed in this folder — do not add packages)

- react / react-dom 18.3.1, typescript 5.6, vite 5.4 (+ @vitejs/plugin-react), tailwindcss 3.4 + postcss + autoprefixer
- framer-motion 11.11, three 0.170 (+ @types/three), lenis 1.1.18, lucide-react 0.468
- Use `three/examples/jsm/geometries/RoundedBoxGeometry.js` and `three/examples/jsm/utils/BufferGeometryUtils.js` from the installed three package.
- No other UI or animation libraries. No GSAP. No network calls at runtime except the Google Fonts stylesheet.
- Keep the existing `vite.config.ts` (`base: './'`), `package.json` scripts and `tsconfig.json`. `npm run build` (tsc + vite build) MUST pass with zero errors.

## BLOCK 2 — FONTS

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;700&family=Silkscreen&display=swap" rel="stylesheet">
```

- **Geist** 400/500 — everything (replaces the reference's neo-grotesk). Headlines weight 400, `letter-spacing: -0.045em`, `line-height: 0.95`.
- **Geist Mono** 400/500 — tiny UPPERCASE labels, tags, counters, buttons (`font-size: 11px`, `letter-spacing: 0.06em`).
- **Noto Sans SC** — Chinese text (font stack: `'Geist', 'Noto Sans SC', system-ui, sans-serif`). When the page language is `zh`, headline letter-spacing becomes `-0.02em` and line-height `1.08`.
- **Silkscreen** — ONLY for three pixel accents: the loader caption "LOADING KAPY", the sticker labels in the CTA, and the "8-BIT" micro badge in the header. Never for body or headlines.

tailwind.config `theme.extend.fontFamily`: `sans: ['Geist','Noto Sans SC','system-ui','sans-serif']`, `mono: ['"Geist Mono"','ui-monospace','monospace']`, `pixel: ['Silkscreen','monospace']`.

## BLOCK 3 — COLOR SYSTEM

Define as CSS variables on `:root` and as Tailwind colors:

| token | value | paints |
| --- | --- | --- |
| `--paper` | `#F1F0EB` | page background (hero, intro, studio, skins header, footer top) |
| `--paper-2` | `#E6E4DC` | pill buttons (light), card placeholders, hover fills |
| `--ink` | `#14131A` | primary text, dark pill buttons, dark sections (fly-through, CTA) |
| `--ink-2` | `#2A2833` | secondary dark surfaces, menu dark card |
| `--muted` | `#6E6B76` | secondary text, captions |
| `--line` | `rgba(20,19,26,0.12)` | hairlines, card borders |
| `--yuzu` | `#FF8A1F` | THE accent: ribbon, active dots, cursor trail head, CTA button, links on hover |
| `--yuzu-deep` | `#E56A00` | accent hover / pressed |
| `--leaf` | `#6FAE4E` | yuzu leaf, small "live" status dots |
| `--capy` | `#B07A45` | Kapy brown, used inside the 3D scene and stickers only |
| `--scene` | `#17232B` | hero WebGL card background (deep ink-teal) |
| `--cream-3d` | `#F3EEE2` | light 3D pieces |

Negative constraints: no purple, no neon green, no gradients on text, no drop shadows on headlines, no glassmorphism except the menu cards' `backdrop-filter: blur(16px)`.

## BLOCK 4 — ASSET MANIFEST

`target_asset_mode: local-assets-primary`. All real product assets already exist in `public/assets/` — use them exactly (reference them as `./assets/...`):

- `KAPY_ICON` `./assets/kapy-icon.png` — app icon (favicon, header mark, footer).
- `KAPY_SHEET` `./assets/kapy/sheet-a.png` — transparent 1254×1254 sprite sheet (5×2 grid) of Kapy.
- `KAPY_FRAMES` `./assets/kapy/sprite-<pose>-<a|b>.png`, 252×336 transparent, feet pivot at (126, 320). Poses: `idle walk-a walk-b work paint repair carry play sleep celebrate coffee stretch type inspect sweep`. Alternate `-a`/`-b` every 220ms to animate. Always render with `image-rendering: pixelated`.
- `SKIN_SKY` `./assets/skins/sky-ruins.jpg`, `SKIN_BLOSSOM` `./assets/skins/blossom-bridge.jpg`, `SKIN_DUSK` `./assets/skins/dusk-wall.jpg`, `SKIN_JADE` `./assets/skins/jade-grove.jpg` — 1536×1024 painterly pixel-game scene backgrounds.
- `SHOT_WORKBENCH` `./assets/shots/kapy-workbench.png` — real app screenshot (agent timeline + live pixel studio).
- `SHOT_BANNER` `./assets/shots/kapy-banner.jpg` — Kapy in five poses on a mossy ledge (1536×600).
- `SHOT_HOME_SKY|BLOSSOM|DUSK|JADE` `./assets/shots/home-<skin>.png` — real app home screen in each skin (960×504).

ONE generated asset (use your image generation tool; save into `public/assets/stickers/`):

`STICKER_SHEET` [PNG, 1536×1024, TRUE transparent background, 4 columns × 3 rows, each sticker centred in its cell with ≥40px empty margin]: twelve chunky die-cut sticker icons in a cute pixel-art style with a thick white sticker border and a soft dark outline, consistent lighting from upper-left, palette locked to yuzu orange #FF8A1F, leaf green #6FAE4E, capybara brown #B07A45, cream #F3EEE2, ink #14131A, sky blue #8EC5E8, coral #E8897C. Cells in order: (1) a yuzu fruit with one leaf, (2) a retro game controller, (3) a paintbrush with a wet orange tip, (4) a small hammer, (5) a steaming teal coffee mug, (6) a pixel heart, (7) a four-point sparkle star, (8) a floppy disk, (9) a cartoon play button triangle, (10) a pixel trophy cup, (11) a magnifying glass, (12) a tiny potted sprout. No text, no letters, no watermark, no logo. Slice it in code with CSS `background-position` (or crop to 12 files `sticker-01.png … sticker-12.png`). If image generation is unavailable, draw the twelve icons as inline SVG in the same style instead — never leave placeholders.

## BLOCK 4B — REFERENCE TIMELINE (what was observed on the reference; re-create the technique, not the content)

- REF_T0–T20s: black full-screen loader; huge rolling 3-digit counter `000 → 100` bottom-left (digits roll vertically like an odometer); a short white bar in the exact centre fills left→right; at 100 the bar splits into two blocks that tilt toward the mouse, then snap into the brand mark; four black corner triangles wipe away to reveal the page.
- REF_HERO: light page, wordmark top-left, a one-line tagline revealing line-by-line from a mask, right side = round icon button + dark pill + light "MENU ••" pill; a 20px-radius dark card spanning the content width holds a physically-simulated cluster of glossy 3D pieces (white / black / one strong accent colour) with depth-of-field blur, slowly tumbling; pieces get pushed away by the cursor; the card background colour drifts slowly; under the card a row of "+" markers on the grid columns with "SCROLL TO EXPLORE" centred; a colourful ribbon trail follows the cursor.
- REF_INTRO: giant two-line headline (line 1 indented ~1/6 width, line 2 flush left), paragraph in the right half, small pill button with a dot; a thick accent-coloured 3D tube draws itself with scroll and weaves behind the headline and a 20px-radius video card in the lower-left.
- REF_REEL: the small card scales up with scroll into an almost full-width rounded card with "PLAY [▶ pill] REEL" overlaid in huge white type; "+" markers at the card corners; clips cycle.
- REF_WORK: "Featured Work" giant title left, tiny uppercase description right; full-bleed 2-column grid of image cards; under each image a tag row (`CONCEPT • WEB • 3D`) and the title; on hover a "→" slides in before the title and the title letters roll (each letter is a vertical stack of copies).
- REF_TUNNEL: a very long pinned section — dark 3D tunnel fly-through driven by scroll with chromatic edge glow, big kinetic words in between.
- REF_CTA: black space; a 3D character waves in the centre; die-cut sticker objects float and orbit in depth; tiny line "IS YOUR BIG IDEA READY…?" above a giant white two-line "Let's work together!"; "CONTINUE TO SCROLL" pill at the bottom.
- REF_MENU: clicking MENU turns it into "CLOSE ✕" and drops a stack of rounded cards under it: nav list with an active dot, a newsletter card with an email input, a dark "LABS ↗" card.
- REF_SCROLL: Lenis-style inertial smooth scrolling everywhere.

## BLOCK 5 — GLOBAL LAYOUT, CSS AND MOTION TOKENS

- Page side padding `--px: max(5vw, 40px)`; 12-column grid with `--gap: 2vw`; media radius `--radius: 20px`; header height 96px.
- `html { background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased; }` `::selection { background: var(--yuzu); color: var(--ink); }`.
- Easing tokens: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; `--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)`. Framer `ease: [0.22, 1, 0.36, 1]`.
- Lenis: `new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })`, driven from one shared `requestAnimationFrame` loop; expose scroll progress via a React context/store; use native `position: sticky` for pinned sections (Lenis keeps native scroll so sticky works).
- Respect `prefers-reduced-motion: reduce`: skip loader animation (show page after fonts load), disable cursor trail, freeze 3D scenes on one rendered frame, replace scroll scrubs with simple fades.
- Performance: pointer, cursor, scroll and WebGL updates use refs + rAF + CSS variables/transforms — never per-frame React state. Each WebGL scene pauses when off-screen (IntersectionObserver). Device pixel ratio capped at `Math.min(devicePixelRatio, 1.75)`.

## BLOCK 6 — LANGUAGE

Bilingual page. Default language = `zh` when `navigator.language` starts with `zh`, otherwise `en`. A small mono toggle `EN / 中文` sits in the header (left of the round button) and in the footer; it swaps every string from one dictionary object `copy.ts` and sets `<html lang>`. All copy below is given as `EN | ZH` — use it verbatim.

## BLOCK 7 — SECTIONS (in order)

### 7.1 Loader (`<Loader/>`, fixed, z-index 100, background `#14131A`)

1. Bottom-left counter: `000 → 100` in Geist 300, `font-size: clamp(96px, 16vw, 260px)`, `line-height: 0.8`, color `#F1F0EB`, positioned `left: var(--px); bottom: -0.08em`. Each digit is an odometer column (0–9 stacked) translated with `transform: translateY(-n * 10%)`, `transition: transform 420ms var(--ease-out)`, staggered 60ms per column. Progress = real image preloading of all `./assets/**` used above the fold + `document.fonts.ready`, eased so it never jumps more than 7 per 120ms; minimum duration 1.6s, maximum 6s.
2. Centre: a pixel bar 200×28px made of 10 square cells (20×28, 2px gap) that fill white one by one with progress. Under it, centred, `LOADING KAPY` in Silkscreen 11px, `#6E6B76`.
3. At 100: the ten cells fly (spring, stiffness 260, damping 22, stagger 25ms) into a 5×5 pixel-art **yuzu** (orange cells `#FF8A1F`, two green leaf cells `#6FAE4E`) 140px wide; the yuzu tilts toward the pointer (max ±14°). Hold 450ms.
4. Exit: four black right-triangles in the viewport corners (each 60vmax) remain while the centre clears: animate the loader's `clip-path` from `polygon(0 0,100% 0,100% 100%,0 100%)` to an expanding diamond reveal (900ms `--ease-inout`), so the page appears through a growing rotated square while the corners wipe out last. Then unmount. Hero entrance starts at reveal 60%.

### 7.2 Header (`<Header/>`, fixed, z-index 50, `mix-blend-mode: normal`, height 96px, padding `0 var(--px)`)

- Left: `KAPY_ICON` 28px with `border-radius: 8px` + wordmark `Kapy.ai` Geist 500 22px `letter-spacing: -0.02em`; a micro badge `8-BIT` in Silkscreen 9px on `--paper-2`, radius 4px, padding 2px 5px, vertically centred beside the wordmark.
- Centre-left (starts at grid column 4): the hero tagline, see 7.3 — only shown while `scrollY < 40vh`, fades + slides up 12px when leaving.
- Right, gap 10px: language toggle (mono 11px `EN / 中文`, active one `--ink`, other `--muted`); round button 40px `--paper-2` with a 14×2px ink dash that becomes a 3-bar equaliser while ambient sound is on (sound = optional soft synth pad generated with WebAudio, OFF by default, never autoplay); dark pill `GET KAPY ●` (`--ink` bg, `#F1F0EB` text, mono 11px, height 40px, padding 0 18px, the ● is a 6px `--yuzu` dot) linking to `https://github.com/nepheloovo/Kapy.ai` in a new tab; light pill `MENU ●●` (`--paper-2`, two 4px ink dots).
- All pills use the **RollText** contract on hover.
- Over dark sections (fly-through, CTA) the header text switches to `#F1F0EB` and light pills to `rgba(241,240,235,0.12)` with white text — detect with IntersectionObserver on `[data-theme="dark"]` sections (180ms colour transition).

**MenuStack** (opens from MENU; MENU label rolls to `CLOSE ✕`): a 300px-wide column of cards right-aligned under the pills, 8px gap, each card `border-radius: 16px`, entering with y: -12 → 0, opacity 0 → 1, stagger 60ms, spring (stiffness 320, damping 28):
1. White card `#FFFFFF`, padding 18px 20px: nav list Geist 400 17px, line-height 2 — `Home | 首页`, `How it works | 工作原理`, `The studio | 工作室`, `Skins | 皮肤`, `Get started | 开始使用`. Active item shows a 6px ink dot at the right. Each item smooth-scrolls (Lenis `scrollTo`, offset -96) to its section and closes the menu.
2. White card: `Star Kapy on GitHub | 在 GitHub 上给 Kapy 点星` (Geist 500 22px, line-height 1.1), below it a light-grey field-shaped button (`--paper-2`, radius 10px, height 44px) reading `github.com/nepheloovo/Kapy.ai` in mono 11px with a `→` on the right; links to the repo.
3. Dark card `--ink-2`, height 64px, padding 0 20px: a 16px animated Kapy idle frame + `DOCS | 文档` mono 12px in white, `↗` on the right; links to `https://github.com/nepheloovo/Kapy.ai#readme`.
Close on Escape, outside click, or menu item click.

### 7.3 Hero (`id="home"`, `data-theme="light"`, height `100dvh`, min-height 720px)

- Tagline (in the header row, grid columns 4–8, Geist 400 `clamp(17px,1.35vw,22px)`, line-height 1.25, max 2 lines): `We turn one sentence into a reviewed, playable game — with a pixel capybara watching over every build. | 一句话，变成一款经过审查、可以直接玩的游戏——每次构建，都有一只像素卡皮巴拉在旁边盯着。` Reveal per line with **RevealLines** (delay 0.15s after loader reveal 60%).
- **HeroSceneCard**: `position: absolute; left: var(--px); right: var(--px); top: 120px; bottom: 64px; border-radius: var(--radius); overflow: hidden; background: var(--scene)`. Enters with `clip-path: inset(8% 6% 8% 6% round 20px) → inset(0 0 0 0 round 20px)` and scale 1.06 → 1 over 1.4s `--ease-out`. The card background colour drifts every 9s through `#17232B → #2A2420 → #1B1E2C → #17232B` (CSS transition 3s) and the WebGL clear colour follows it.
- **VoxelCluster** (three.js inside the card; see contract in BLOCK 8).
- Bottom-left inside the card (left 28px, bottom 24px): a live status chip — mono 11px `#F1F0EB` on `rgba(255,255,255,0.08)`, radius 999px, padding 8px 12px: `● PLANNER → IMPLEMENTER → REVIEWER → PLAYTEST` where the `●` is `--leaf` and one stage label at a time is highlighted `--yuzu`, advancing every 1.6s. ZH: `● 策划 → 程序 → 质检 → 试玩`.
- Bottom-right inside the card: a 72px-tall animated Kapy (`type` pose, a/b frames) peeking from the card edge, `image-rendering: pixelated`, bobbing 3px every 1.2s.
- Under the card (bottom 0, height 64px): **CrossRow** — five `+` glyphs (Geist 300, 14px, `--ink`) at grid columns 1, 3.5, 6.5, 9.5, 12 boundaries; in the centre `SCROLL TO EXPLORE | 向下探索` mono 11px with a 1px × 18px line beneath that scales Y 0→1→0 on a 1.8s loop.

### 7.4 Intro (`id="how"`, padding-top 22vh, padding-bottom 14vh)

- Headline Geist 400 `clamp(56px, 8.2vw, 148px)`, two lines: line 1 `One sentence,` with `padding-left: calc(16.66% + var(--gap))`, line 2 `brought to play.` flush left. ZH: line 1 `一句话，` line 2 `就能开玩。` Reveal: **RevealLines** triggered at 20% into view.
- Right column (grid columns 7–11), 9vh below the headline: paragraph Geist 400 `clamp(17px,1.25vw,21px)`, line-height 1.45, max-width 34em: `Kapy.ai pairs a disciplined team of AI agents with a real game engine. A Planner scopes your idea, an Implementer builds it, a Reviewer checks every claim against the actual files — and a hidden browser plays the result before you ever see it. | Kapy.ai 让一支讲规矩的 AI 小队配上真正的游戏引擎：策划拆解你的创意，程序把它做出来，质检对照真实文件逐条核查——在你看到之前，隐藏浏览器已经替你把游戏玩了一遍。` Then 36px below: white pill (`#FFFFFF`, height 40px, padding 0 18px, radius 999px, box-shadow `0 1px 0 rgba(20,19,26,0.06)`) `● HOW IT WORKS | ● 看看怎么做到的` (dot `--ink`), scrolls to The Studio.
- Lower-left media card (grid columns 1–5, `aspect-ratio: 16/10`, radius 20px, starts 6vh below the paragraph's top): `SHOT_WORKBENCH`, `object-fit: cover; object-position: 30% 40%`, inner parallax translateY −6% → 6% across its scroll range, with a duotone treatment: `filter: grayscale(1) contrast(1.05)` under a `mix-blend-mode: multiply` overlay of `#FF8A1F` at 0.85 opacity — on hover the overlay fades to 0 and the grayscale to 0 over 600ms, revealing true colour.
- **ScrollRibbon** contract (BLOCK 8) draws behind headline and card.

### 7.5 Demo Reel (`<ExpandingReel/>`, a 220vh tall track with a sticky 100dvh stage)

- Sticky stage holds one rounded card that scales from the intro card's rect (grid columns 1–5) to `left/right: var(--px)`, `top: 12vh`, `bottom: 12vh` as progress goes 0 → 0.55 (interpolate the clip rect, not the image), radius stays 20px; four `+` crosses sit 14px outside the card corners and travel with it.
- Inside: a slideshow that crossfades every 2.4s (900ms) through `SHOT_WORKBENCH`, `SHOT_HOME_SKY`, `SHOT_HOME_BLOSSOM`, `SHOT_HOME_DUSK`, `SHOT_HOME_JADE`, `SHOT_BANNER`, each with a slow Ken-Burns `scale 1.04 → 1.12` over 6s.
- Overlay (centred, white `#FFFFFF`, Geist 400 `clamp(64px, 9vw, 168px)`, letter-spacing −0.05em, `text-shadow: 0 2px 30px rgba(0,0,0,0.25)`): `PLAY` + a white pill 1.1em × 0.62em with a black ▶ (lucide `Play`, filled) + `DEMO`. ZH: `看` + pill + `演示`. The words slide apart horizontally (`-12vw` / `+12vw` → 0) as progress 0.2 → 0.55.
- Clicking the pill opens a full-screen lightbox (ink bg, Escape/✕ to close) that plays the same slideshow larger with the caption `Real screens from Kapy.ai — the workbench and its four skins. | 真实的 Kapy.ai 界面——工作台与四套皮肤。`.

### 7.6 The Studio (`id="studio"`)

- Header row: `The Studio | 工作室阵容` Geist 400 `clamp(56px,7.5vw,136px)` left; right column (grid 10–12) mono 11px uppercase line-height 1.5: `SIX STEPS BETWEEN YOUR IDEA AND A GAME YOU CAN PLAY. | 从一个点子到一款能玩的游戏，中间只隔着六步。`
- Grid: 2 columns, gap `var(--gap)`, full-bleed to the page padding, 6 cards. Card = image box `aspect-ratio: 4/3; border-radius: 0` on desktop (full-bleed look like the reference; 16px on mobile), background `--paper-2` while loading, then: tag row (mono 11px `--muted`, margin-top 16px) and title (Geist 400 `clamp(28px, 2.6vw, 44px)`, margin-top 6px).
  1. `01 · PLAN • READ-ONLY • SCOPE` — `Planner | 策划` — image: `SKIN_SKY` with an animated Kapy `work` pose (reading a blueprint) 30% height, bottom-left 12%.
  2. `02 · BUILD • WEB • GODOT 4` — `Implementer | 程序` — `SKIN_DUSK` + Kapy `type`.
  3. `03 · REVIEW • EVIDENCE • 3 REPAIRS` — `Reviewer | 质检` — `SKIN_JADE` + Kapy `inspect`.
  4. `04 · PLAYTEST • INPUTS • SCREENSHOTS` — `Playtest | 试玩` — `SKIN_BLOSSOM` + Kapy `play`.
  5. `05 · ART • AUDIO • 3D` — `Asset forge | 素材工坊` — `SHOT_BANNER` (object-position 50% 60%), no extra sprite.
  6. `06 · LOCAL • GIT • YOURS` — `Your folder | 归你所有` — `SHOT_WORKBENCH` (object-position 70% 50%), no extra sprite.
  Each card also shows a one-line description under the title (Geist 400 16px `--muted`): 1 `Reads your workspace and turns the idea into an ordered plan. | 先读懂工程，再把创意拆成有序的计划。` 2 `Builds the real project, art and code, inside its own folder. | 在独立文件夹里做出真实的工程、美术和代码。` 3 `Checks every claim against the files and sends back fixes. | 对照真实文件逐条核查，不合格就退回修。` 4 `A hidden browser presses the real keys and records proof. | 隐藏浏览器按下真实按键，并留下截图证据。` 5 `Images, music, voice, sound and 3D, with retryable work orders. | 图片、音乐、配音、音效和 3D，失败可单独重试。` 6 `Every game is a normal folder you can open, commit and keep. | 每个游戏都是你能打开、提交、带走的普通文件夹。`
- Hover (pointer devices): image scales 1 → 1.04 (900ms `--ease-out`), sprite switches to the `celebrate` pose, a `→` (lucide `ArrowRight`, 0.8em) slides in from −16px/opacity 0 before the title while the title shifts +1.1em, and the title runs **RollText**.
- Cards reveal on scroll: translateY 60px → 0, opacity 0 → 1, 900ms, stagger by column 120ms.

### 7.7 Pick Your World (`id="skins"`, track height `400vh`, sticky 100dvh stage, background `--paper`)

- Sticky stage: top-left title `Pick your world. | 挑一个你的世界。` Geist 400 `clamp(48px,6vw,112px)`; top-right mono 11px: `FOUR HAND-PAINTED SCENES RETINT THE WHOLE APP. | 四套手绘场景，给整个应用换装。`
- A horizontal rail translates `x` from 0 to `-(railWidth - viewport + 2*px)` with vertical scroll progress. Four panels, each `width: 72vw; height: 62vh; border-radius: 20px; margin-right: 2vw`, background = the skin JPG (`object-fit: cover`), with an inner parallax (image translateX opposite the rail by 8%).
- On each panel, bottom-left: a 22vh-tall live mini-mockup = the matching `SHOT_HOME_*` screenshot in a 14px-radius frame with a 2px ink border and a hard 6px 6px offset shadow `rgba(20,19,26,0.35)` (echoes the app's pixel stone frames), tilted −2°; bottom-right: the skin name (Geist 500 `clamp(28px,3vw,52px)`, white, text-shadow `0 2px 18px rgba(0,0,0,0.35)`) and a row of three 14px colour swatches:
  - `Sky Ruins | 天空遗迹` — swatches `#DCEAF3 #B9634F #E8897C`
  - `Blossom Bridge | 花影石桥` — `#F6DFDC #5D5872 #C0476B`
  - `Dusk Wall | 暮光古墙` — `#F1E3B3 #6E6F73 #3D4A3A`
  - `Jade Grove | 翡翠秘林` — `#BFE3CF #4D7259 #D0473A`
- An animated Kapy `walk` sprite (a-a, a-b, b-a, b-b frames at 130ms each) walks along the bottom edge of the stage from left to right in sync with progress (x = progress × (viewport − 120px)), 96px tall.
- A thin progress line under the rail (1px `--line`, filled segment `--ink`) with four mono labels `01 02 03 04`.

### 7.8 Pixel World Fly-through (`id="world"`, `data-theme="dark"`, track `500vh`, sticky 100dvh stage, background `#0E0D12`)

- **PixelTunnel** contract (BLOCK 8): a three.js scene where the camera flies forward with scroll through 12 depth-stacked planes built from the four skin JPGs (each skin used 3×, alternating), with fog, vignette and a chromatic edge glow.
- Kinetic type over the canvas, three lines that appear one at a time across progress 0.1–0.35, 0.35–0.6, 0.6–0.85, each line Geist 400 `clamp(64px, 11vw, 220px)`, letter-spacing −0.05em, `#F1F0EB`, centred; each line enters by letters rising from `translateY(110%)` inside an overflow-hidden mask (stagger 22ms) and leaves by scaling to 1.6 with blur 0 → 12px and opacity → 0 as the camera passes it: `STEP INTO` → `YOUR OWN` → `PIXEL WORLD`. ZH: `走进` → `属于你的` → `像素世界`.
- At progress 0.85–1 the tunnel brightens to a warm yuzu glow `#FF8A1F` at the vanishing point, handing off to the CTA.

### 7.9 CTA (`id="start"`, `data-theme="dark"`, height `100dvh` + 40vh lead-in, background `#0E0D12`)

- **StickerField** contract (BLOCK 8) fills the section.
- Centre: Kapy `celebrate` (alternating a/b every 260ms) at 34vh tall, pixelated, with a soft yuzu radial glow behind (`radial-gradient(circle, rgba(255,138,31,0.35), transparent 60%)`, 60vh); on hover Kapy switches to `stretch` then back.
- Above (z above Kapy): small line mono 12px `#F1F0EB` at 0.7 opacity: `IS YOUR GAME IDEA READY TO PLAY? | 你的游戏点子准备好了吗？`; then the giant two-line headline Geist 400 `clamp(72px, 10vw, 196px)`, `#FFFFFF`, centred, line-height 0.92: `Let's make` / `a game!` ZH: `一起做个` / `游戏吧！`. Letters use **RollText** on hover of each line.
- Below: a yuzu pill (`--yuzu` bg, `--ink` text, height 52px, padding 0 26px, mono 12px, radius 999px) `GET KAPY ON GITHUB ↗ | 去 GitHub 获取 KAPY ↗` → repo, hover `--yuzu-deep` + RollText; next to it an outline pill (1px `rgba(241,240,235,0.3)`, white text) `READ THE DOCS | 阅读文档` → README.
- Four `+` crosses at 18% / 82% horizontally and 22% / 78% vertically, `rgba(241,240,235,0.5)`.

### 7.10 Footer (`data-theme="light"`, background `--paper`, padding 14vh var(--px) 40px)

- Row 1: giant wordmark `Kapy.ai` Geist 500 `clamp(96px, 19vw, 360px)`, letter-spacing −0.06em, line-height 0.8, spanning the width; the dot of `.ai` is replaced by a 0.18em yuzu-orange square pixel.
- Row 2 (4 columns, mono 11px uppercase, `--muted` labels, `--ink` links, line-height 1.9):
  - `PRODUCT | 产品`: `How it works | 工作原理`, `The studio | 工作室`, `Skins | 皮肤`
  - `OPEN SOURCE | 开源`: `GitHub ↗`, `README ↗`, `MIT License ↗` (→ `https://github.com/nepheloovo/Kapy.ai/blob/main/LICENSE`)
  - `REQUIREMENTS | 运行要求`: `macOS`, `Node.js 22`, `ChatGPT / Codex account | ChatGPT / Codex 账号`
  - Language toggle `EN / 中文` + a 40px animated Kapy `coffee` sprite.
- Row 3 (hairline above): `© 2026 Kapy.ai · Made with 🍊 and a very patient capybara. | © 2026 Kapy.ai · 由 🍊 和一只非常有耐心的卡皮巴拉制作。` left; `Back to top ↑ | 回到顶部 ↑` right (Lenis scrollTo 0).

## BLOCK 8 — NAMED COMPONENT CONTRACTS

**RollText** — wraps a label; each character is an inline-block with `overflow: hidden; height: 1.05em`, containing two stacked copies. On hover of the trigger, both copies translateY −100% with per-character stagger 18ms, 520ms `--ease-out`; on leave they return. Spaces keep their width. Works for CJK characters too.

**RevealLines** — splits text into visual lines (measure with a hidden clone after fonts load; re-split on resize, debounced 150ms); each line is wrapped in an overflow-hidden mask and its inner span animates `translateY(105%) rotate(2deg) → 0` and opacity 0 → 1, 1000ms `--ease-out`, stagger 90ms, triggered by IntersectionObserver (threshold 0.2) once.

**CrossMarker** — a `+` made of two 1px × 14px lines in `currentColor`, absolutely positioned; used for CrossRow, reel card corners and CTA.

**CursorBlob + CursorTrail** (pointer:fine only; hide native cursor only over `[data-cursor="blob"]` = hero card and studio images): a 14px ink dot following the pointer with lerp 0.22; over hero card and studio images it grows to 84px, `mix-blend-mode: difference`, white, and shows a mono 10px label (`DRAG | 拖动` on hero, `VIEW | 查看` on images). Trail: a fixed full-screen 2D canvas drawing a ribbon through the last 26 pointer samples, width tapering 10px → 0, colour gradient along its length `#FF8A1F → #E8897C → #8EC5E8 → #6FAE4E`, alpha fading with age (samples expire after 450ms), drawn with quadratic curves; disabled on touch and reduced-motion.

**VoxelCluster** (three.js, inside HeroSceneCard):
- Renderer: antialias, alpha false, `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`, exposure 1.05, shadows off. Camera: PerspectiveCamera fov 32, position (0, 0, 14). Lights: HemisphereLight(`#FFFFFF`, `#1A1A22`, 0.9) + DirectionalLight(`#FFF4E6`, 2.2) at (5, 8, 6) + DirectionalLight(`#8EC5E8`, 0.6) at (−6, −2, −4) + a RoomEnvironment PMREM (`three/examples/jsm/environments/RoomEnvironment.js`) as `scene.environment` for glossy reflections.
- Pieces (52 total on desktop, 26 on mobile < 768px): three geometries merged per piece with BufferGeometryUtils — (a) **pixel cross**: five RoundedBoxGeometry(1, 1, 1, 4, 0.18) cubes in a plus shape; (b) **voxel L / T tetromino**: four rounded cubes; (c) **yuzu**: SphereGeometry(0.9, 48, 32) slightly squashed (scale y 0.92) + a tiny leaf (flattened RoundedBox 0.5×0.08×0.28, rotated 30°, color `#6FAE4E`) + a 0.12 stem. Each piece scale 0.55–0.85.
- Materials: MeshPhysicalMaterial, `roughness 0.28, clearcoat 1, clearcoatRoughness 0.12, metalness 0`. Colour mix by count: 40% `#F3EEE2` cream, 30% `#14131A` ink (roughness 0.18), 20% `#FF8A1F` yuzu (all yuzu spheres are this colour), 10% `#B07A45` capy brown.
- Simulation (custom, no physics lib): pieces live in a cluster; each frame apply (1) attraction toward the origin `F = -k * p` (k 0.9), (2) soft sphere-sphere separation between pieces (radius by scale, stiffness 14), (3) damping 0.9 per frame at 60fps (frame-rate independent via dt), (4) a slow global angular drift (cluster group rotates y 0.06 rad/s, x 0.025 rad/s), (5) per-piece spin from angular velocity with damping. Pointer: raycast the pointer onto the z = 0 plane; pieces within radius 2.8 get pushed away with force `24 * (1 - d/2.8)^2`; dragging (pointer down + move) imparts velocity in the drag direction × 0.04 — label the cursor `DRAG`.
- Depth of field look without postprocessing: sort pieces by camera distance and give far pieces a slightly lower emissive + `scene.fog = new THREE.Fog(clear, 12, 24)`; additionally overlay the card with a CSS `backdrop-filter`-free vignette: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35))`.
- Intro: pieces start scattered at radius 9–12 with opacity 0 and fly in over 1.6s (stagger by index × 12ms) once the loader reveal hits 60%. Scroll: as the hero leaves (progress 0 → 1), the cluster scales 1 → 1.25 and rotates x +0.6 rad.

**ScrollRibbon** — an absolutely positioned full-width SVG behind the intro section (z-index below text/card): a single cubic-bezier path that enters from the left edge at the headline's mid-height, loops once behind the word "sentence/一句话", dives down behind the media card's top-right corner and exits bottom-right. Stroke `#FF8A1F`, width `clamp(28px, 3.2vw, 56px)`, `stroke-linecap: round`. Fake 3D tube shading: draw the same path three times — base `#E56A00` at full width, mid `#FF8A1F` at 70% width offset −2px y, highlight `rgba(255,255,255,0.55)` at 18% width offset −0.22×width y. Draw-on via `stroke-dasharray = pathLength; stroke-dashoffset = pathLength × (1 − p)` where p maps section scroll 0.05 → 0.75 with `--ease-inout`.

**PixelTunnel** (three.js in the fly-through stage):
- 12 textured planes (PlaneGeometry 16×10.7 with the skin JPGs, MeshBasicMaterial, transparent) placed along −z every 6 units (z = −6 … −72), each alternately offset x ±3.5 and y ±1.2 and rotated z ±0.06; between them 600 instanced tiny cubes (0.06–0.18 size) forming a square tunnel wall of "pixel dust" (colours from the four skin swatches, MeshBasicMaterial, additive blending, opacity 0.75).
- Camera z = 2 − progress × 74, with a gentle bank `rotation.z = sin(progress × π × 2) × 0.08` and pointer parallax ±0.4.
- Planes fade in from opacity 0 at distance 30 to 1 at distance 10, and fade out within the last 2 units before the camera passes.
- Fog `#0E0D12` (near 6, far 34). Post look via CSS overlays on the canvas: vignette `radial-gradient(ellipse at center, transparent 45%, rgba(14,13,18,0.85))` and a chromatic edge glow made of two inset `box-shadow`s: `inset 0 0 120px rgba(255,138,31,0.18), inset 0 0 220px rgba(142,197,232,0.12)`.

**StickerField** (three.js, or CSS-3D if simpler, but must feel like depth): 22 sprites using the 12 stickers (repeat some), each a plane facing the camera, sizes 70–150px equivalent, distributed in a shell around the centre (radius 0.35–0.55 of the viewport, z −2…+2), slowly orbiting (0.05–0.12 rad/s, random axes), bobbing ±10px, rotating ±12°. Pointer: stickers within 220px of the pointer get pushed outward (spring back, stiffness 60, damping 12) and tilt toward the pointer. Clicking a sticker makes it pop (scale 1 → 1.25 → 1, 380ms) and spawns 8 tiny pixel squares in the sticker's dominant colour that fly out and fade (600ms). Depth: further stickers are 15% smaller, 20% dimmer and blurred 1.5px (CSS) or fogged.

**SpriteAnimator** — `<Kapy pose="type" height={72} interval={220} />` renders the `-a`/`-b` frames (or the 4 walk frames for `walk`), preloaded, swapping `src` via ref on a shared rAF clock (not per-component setInterval), with `image-rendering: pixelated` and the feet pivot respected (anchor bottom-centre at 95% of frame height).

## BLOCK 9 — RESPONSIVE

- `< 1024px`: grid becomes 8 columns; studio grid stays 2 columns; skins panels `width: 82vw`.
- `< 768px`: header shows icon + wordmark + `MENU` only (GET KAPY moves into the menu stack); hero card `top: 96px; bottom: 56px`, tagline moves inside the hero above the card (left aligned, 15px); intro headline left aligned (no indent); studio grid 1 column with 16px radii; skins rail becomes a vertical stack of 4 panels (no pin); fly-through track 300vh with 8 planes; StickerField uses 12 stickers; cursor blob/trail off; all headline clamps keep the minimums above.
- No horizontal page scroll at any width (test 360px, 768px, 1280px, 1440px, 1920px).

## BLOCK 10 — DESIGN GUARDRAILS

- Calm first, playful second: lots of air, only one accent colour per view.
- The headline type is always large, light (400), tight, and never bold.
- Kapy sprites are always pixel-crisp (no smoothing) and never stretched non-uniformly.
- Every interactive element has hover AND focus-visible styles (2px `--yuzu` outline, 3px offset); all links/buttons keyboard reachable; images have meaningful `alt` in the current language; `aria-label`s on icon buttons; the menu traps focus while open.
- Lighthouse-friendly: lazy-load below-the-fold images (`loading="lazy"`, `decoding="async"`), WebGL scenes init only when near the viewport (rootMargin 200px) and dispose on unmount.
- Do not invent features the product does not have. Do not add pricing, testimonials, logos of companies, newsletter backends or analytics.

## BLOCK 11 — FILE STRUCTURE & DELIVERY

```
src/
  main.tsx, App.tsx, index.css
  copy.ts                      (EN/ZH dictionary + language store)
  lib/scroll.ts                (Lenis + shared rAF clock + progress helpers)
  lib/pointer.ts
  components/                  Loader, Header, MenuStack, RollText, RevealLines, CrossMarker,
                               CursorBlob, CursorTrail, Kapy (SpriteAnimator), LanguageToggle
  sections/                    Hero, Intro, ExpandingReel, Studio, Skins, WorldFlythrough, Cta, Footer
  three/                       VoxelCluster.ts, PixelTunnel.ts, StickerField.ts
public/assets/stickers/        generated sticker sheet or files
```

Recap of the stack: React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + Framer Motion 11 + three.js 0.170 + Lenis 1.1 + lucide-react. No other libraries.

## BLOCK 12 — ACCEPTANCE CHECKS (do all of these before finishing)

1. `npm run build` passes with zero TypeScript errors and zero warnings about missing assets.
2. Every asset path above resolves (no 404s in `vite preview`).
3. Loader counts 000 → 100, forms the pixel yuzu, and reveals the hero; reduced-motion skips it.
4. Hero VoxelCluster renders, reacts to pointer push and drag, pauses off-screen.
5. ScrollRibbon draws with scroll; Demo card expands; Studio hover arrow + RollText work; Skins rail scrolls horizontally while pinned with the walking Kapy; Fly-through camera moves with scroll and the three kinetic lines appear and pass; StickerField reacts to the pointer and pops on click.
6. Language toggle swaps every visible string between EN and 中文 with no leftover English in ZH mode (brand names Kapy.ai / Godot / GitHub / Codex stay as-is).
7. No horizontal overflow at 360 / 768 / 1440px; header colours flip over dark sections.
8. Write a short `site/README.md` with how to run (`npm install`, `npm run dev`, `npm run build`) and how to deploy the `dist/` folder to GitHub Pages.
