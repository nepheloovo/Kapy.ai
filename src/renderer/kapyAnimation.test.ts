import { describe, expect, it } from 'vitest';

import type { KapyAnimation, KapySpriteManifest } from './kapyAnimation';
import {
  advanceKapyFrame,
  kapyFrameAtElapsed,
  kapyManifestSources,
  kapyRestFrameIndex,
  normalizedKapyFrameDuration,
} from './kapyAnimation';

const animation = (overrides: Partial<KapyAnimation> = {}): KapyAnimation => ({
  id: 'test',
  loop: true,
  restFrame: 0,
  frames: [
    { src: 'a.png', durationMs: 100 },
    { src: 'b.png', durationMs: 220 },
    { src: 'c.png', durationMs: 80 },
  ],
  ...overrides,
});

describe('Kapy sprite animation timeline', () => {
  it('honors the duration of every keyframe instead of assuming a uniform interval', () => {
    const clip = animation();
    expect(kapyFrameAtElapsed(clip, 0)).toBe(0);
    expect(kapyFrameAtElapsed(clip, 99)).toBe(0);
    expect(kapyFrameAtElapsed(clip, 100)).toBe(1);
    expect(kapyFrameAtElapsed(clip, 319)).toBe(1);
    expect(kapyFrameAtElapsed(clip, 320)).toBe(2);
    expect(kapyFrameAtElapsed(clip, 400)).toBe(0);
  });

  it('advances looping clips and settles non-looping clips on their authored rest frame', () => {
    expect(advanceKapyFrame(animation(), 2)).toEqual({ frameIndex: 0, finished: false });
    expect(advanceKapyFrame(animation({ loop: false, restFrame: 1 }), 2))
      .toEqual({ frameIndex: 1, finished: true });
    expect(kapyFrameAtElapsed(animation({ loop: false, restFrame: 1 }), 800)).toBe(1);
  });

  it('clamps malformed durations and rest frame indexes to safe values', () => {
    expect(normalizedKapyFrameDuration({ src: 'bad.png', durationMs: Number.NaN })).toBe(40);
    expect(normalizedKapyFrameDuration({ src: 'fast.png', durationMs: 2 })).toBe(40);
    expect(kapyRestFrameIndex(animation({ restFrame: 99 }))).toBe(2);
    expect(kapyRestFrameIndex(animation({ restFrame: -4 }))).toBe(0);
  });

  it('returns each manifest image once so the renderer can preload complete packs', () => {
    const clip = animation();
    const manifest = {
      schemaVersion: 1,
      id: 'test-pack',
      canvas: { width: 252, height: 336, pivot: { x: 126, y: 320 } },
      animations: {
        idle: clip,
        work: clip,
        think: clip,
        carry: clip,
        paint: clip,
        sleep: clip,
        play: clip,
        repair: clip,
        coffee: clip,
        stretch: clip,
        type: clip,
        inspect: clip,
        sweep: clip,
        celebrate: clip,
        wait: clip,
        walk: clip,
      },
    } satisfies KapySpriteManifest;

    expect(kapyManifestSources(manifest)).toEqual(['a.png', 'b.png', 'c.png']);
  });
});
