import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { KAPY_PACK_IDS, KAPY_SCENE_IDS } from '../../shared/contracts';
import {
  KAPY_SCENE_OPTIONS,
  KAPY_SOLO_SCENE_OPTIONS,
  KapyScenePicker,
  KapySoloScenePicker,
} from './KapyScenePicker';

describe('KapyScenePicker', () => {
  it('offers exactly every supported running background', () => {
    expect(KAPY_SCENE_OPTIONS.map((option) => option.id)).toEqual([...KAPY_SCENE_IDS]);
  });

  it('offers every pack scene as a character-independent solo workspace', () => {
    expect(KAPY_SOLO_SCENE_OPTIONS.map((option) => option.id)).toEqual([...KAPY_PACK_IDS]);
    expect(KAPY_SOLO_SCENE_OPTIONS.every((option) => (
      option.badges.includes('单人工作室') && option.badges.includes('角色独立选择')
    ))).toBe(true);

    const markup = renderToStaticMarkup(createElement(KapySoloScenePicker, {
      value: 'starforge',
      onChange: vi.fn(),
    }));

    expect(markup).toContain('aria-label="选择单人工作室"');
    expect(markup).toContain('data-scene-kind="solo"');
    expect(markup).toMatch(
      /<button[^>]*aria-checked="true"[^>]*data-scene-id="starforge"[^>]*data-scene-kind="solo"/u,
    );
    expect(markup).not.toContain('data-scene-id="fishing"');
  });

  it('presents the fishing GIF as a selected dynamic four-person scene', () => {
    const markup = renderToStaticMarkup(createElement(KapyScenePicker, {
      value: 'fishing',
      onChange: vi.fn(),
    }));

    expect(markup).toContain('aria-label="选择多人运行背景"');
    expect(markup).toContain('data-scene-id="fishing"');
    expect(markup).toContain('data-motion="animated"');
    expect(markup).toMatch(
      /<button[^>]*aria-checked="true"[^>]*data-scene-id="fishing"[^>]*data-motion="animated"/u,
    );
    expect(markup).toContain('多人场景 · 02');
    expect(markup).toContain('荷塘钓鱼');
    expect(markup).toContain('动态循环');
    expect(markup).toContain('固定四人');
  });

  it('keeps the collaboration scene available as the static crew-aware option', () => {
    const markup = renderToStaticMarkup(createElement(KapyScenePicker, {
      value: 'collaboration',
      busy: true,
      onChange: vi.fn(),
    }));

    expect(markup).toContain('data-scene-id="collaboration"');
    expect(markup).toContain('data-motion="static"');
    expect(markup).toContain('按编队渲染');
    expect(markup).toContain('aria-busy="true"');
    expect(markup.match(/disabled=""/gu)).toHaveLength(KAPY_SCENE_OPTIONS.length);
  });

  it('keeps multiplayer scenes unselected but keyboard reachable while solo is active', () => {
    const markup = renderToStaticMarkup(createElement(KapyScenePicker, {
      value: null,
      onChange: vi.fn(),
    }));

    expect(markup).toContain('aria-label="选择多人运行背景"');
    expect(markup).not.toContain('aria-checked="true"');
    expect(markup.match(/tabindex="0"/gu)).toHaveLength(1);
  });
});
