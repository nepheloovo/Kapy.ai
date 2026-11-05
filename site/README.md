# Kapy.ai landing page

The product landing page for [Kapy.ai](https://github.com/nepheloovo/Kapy.ai): a single scrolling page with a pixel loader, a 3D voxel hero, a scroll-drawn ribbon, an expanding demo card, the six-step studio, a pinned skins rail, a pixel-world flythrough and a sticker CTA. English / 中文 toggle in the header and footer.

```bash
npm install
npm run dev      # http://127.0.0.1:5180
npm run build    # static files in dist/
npm run preview  # http://127.0.0.1:5181
```

- `src/App.tsx`: every section and effect
- `src/copy.ts`: all English and Chinese text
- `src/index.css`: design tokens and layout
- `public/assets/`: Kapy sprites, skin scenes, screenshots, sticker sheet
- `PROMPT.md`: the full build brief the page was generated from

The build uses a relative base path, so `dist/` can be served from any folder, such as GitHub Pages.
