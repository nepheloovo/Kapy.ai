import kapyCarrySprite from './assets/kapy-sprite-carry.png';
import kapyCelebrateSprite from './assets/kapy-sprite-celebrate.png';
import kapyIdleSprite from './assets/kapy-sprite-idle.png';
import kapyPaintSprite from './assets/kapy-sprite-paint.png';
import kapyPlaySprite from './assets/kapy-sprite-play.png';
import kapyRepairSprite from './assets/kapy-sprite-repair.png';
import kapySleepSprite from './assets/kapy-sprite-sleep.png';
import kapyWalkASprite from './assets/kapy-sprite-walk-a.png';
import kapyWalkBSprite from './assets/kapy-sprite-walk-b.png';
import kapyWorkSprite from './assets/kapy-sprite-work.png';
import kapyCoffeeASprite from './assets/kapy-packs/classic/frames/sprite-coffee-a.png';
import kapyCoffeeBSprite from './assets/kapy-packs/classic/frames/sprite-coffee-b.png';
import kapyInspectASprite from './assets/kapy-packs/classic/frames/sprite-inspect-a.png';
import kapyInspectBSprite from './assets/kapy-packs/classic/frames/sprite-inspect-b.png';
import kapyStretchASprite from './assets/kapy-packs/classic/frames/sprite-stretch-a.png';
import kapyStretchBSprite from './assets/kapy-packs/classic/frames/sprite-stretch-b.png';
import kapySweepASprite from './assets/kapy-packs/classic/frames/sprite-sweep-a.png';
import kapySweepBSprite from './assets/kapy-packs/classic/frames/sprite-sweep-b.png';
import kapyTypeASprite from './assets/kapy-packs/classic/frames/sprite-type-a.png';
import kapyTypeBSprite from './assets/kapy-packs/classic/frames/sprite-type-b.png';
import type {
  KapyAnimation,
  KapyAnimationFrame,
  KapySpriteManifest,
} from './kapyAnimation';

const frame = (src: string, durationMs: number): KapyAnimationFrame => ({ src, durationMs });

const singleFrame = (
  id: string,
  src: string,
  durationMs = 800,
): KapyAnimation => ({
  id,
  frames: [frame(src, durationMs)],
  loop: true,
  restFrame: 0,
});

const alternatingFrames = (
  id: string,
  frameA: string,
  frameB: string,
  durationMs = 220,
): KapyAnimation => ({
  id,
  frames: [
    frame(frameA, durationMs),
    frame(frameB, durationMs),
    frame(frameA, durationMs),
    frame(frameB, durationMs + 80),
  ],
  loop: true,
  restFrame: 0,
});

/**
 * Compatibility manifest for the original Kapy sprite set.
 *
 * New character packs can replace this object with any number of authored
 * frames per pose. Keeping animation data outside the component means a pack
 * never needs pose-specific rendering code.
 */
export const CLASSIC_KAPY_SPRITE_MANIFEST: KapySpriteManifest = {
  schemaVersion: 1,
  id: 'classic-kapy-v1',
  canvas: {
    width: 252,
    height: 336,
    pivot: { x: 126, y: 320 },
  },
  animations: {
    idle: singleFrame('classic-idle', kapyIdleSprite),
    think: singleFrame('classic-think', kapyIdleSprite),
    wait: singleFrame('classic-wait', kapyIdleSprite),
    walk: {
      id: 'classic-walk',
      frames: [
        frame(kapyWalkASprite, 150),
        frame(kapyWalkBSprite, 150),
        frame(kapyWalkASprite, 150),
        frame(kapyWalkBSprite, 150),
      ],
      loop: true,
      restFrame: 0,
    },
    work: singleFrame('classic-work', kapyWorkSprite),
    carry: singleFrame('classic-carry', kapyCarrySprite),
    paint: singleFrame('classic-paint', kapyPaintSprite),
    sleep: singleFrame('classic-sleep', kapySleepSprite, 1_200),
    play: singleFrame('classic-play', kapyPlaySprite),
    repair: singleFrame('classic-repair', kapyRepairSprite),
    coffee: alternatingFrames('classic-coffee', kapyCoffeeASprite, kapyCoffeeBSprite, 360),
    stretch: alternatingFrames('classic-stretch', kapyStretchASprite, kapyStretchBSprite, 340),
    type: alternatingFrames('classic-type', kapyTypeASprite, kapyTypeBSprite, 150),
    inspect: alternatingFrames('classic-inspect', kapyInspectASprite, kapyInspectBSprite, 320),
    sweep: alternatingFrames('classic-sweep', kapySweepASprite, kapySweepBSprite, 240),
    celebrate: singleFrame('classic-celebrate', kapyCelebrateSprite),
  },
};
