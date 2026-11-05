import cozyWorkshopGif from '../assets/kapy-transition-scenes/kapy-cozy-workshop.gif';
import crystalLabGif from '../assets/kapy-transition-scenes/kapy-crystal-lab.gif';
import forestCampGif from '../assets/kapy-transition-scenes/kapy-forest-camp.gif';
import potionGardenGif from '../assets/kapy-transition-scenes/kapy-potion-garden.gif';
import rooftopStudioGif from '../assets/kapy-transition-scenes/kapy-rooftop-studio.gif';
import seasideArcadeGif from '../assets/kapy-transition-scenes/kapy-seaside-arcade.gif';
import skyDockGif from '../assets/kapy-transition-scenes/kapy-sky-dock.gif';
import snowCabinGif from '../assets/kapy-transition-scenes/kapy-snow-cabin.gif';
import starObservatoryGif from '../assets/kapy-transition-scenes/kapy-star-observatory.gif';

export const KAPY_TRANSITION_SCENES = [
  cozyWorkshopGif,
  crystalLabGif,
  forestCampGif,
  skyDockGif,
  seasideArcadeGif,
  snowCabinGif,
  starObservatoryGif,
  potionGardenGif,
  rooftopStudioGif,
] as const;

export const KAPY_TRANSITION_SCENE_COUNT = KAPY_TRANSITION_SCENES.length;

export function kapyTransitionSceneIndex(runId: number): number {
  if (!Number.isFinite(runId) || runId <= 1) return 0;
  return (Math.floor(runId) - 1) % KAPY_TRANSITION_SCENE_COUNT;
}

export function kapyTransitionSceneForRun(runId: number): string {
  return KAPY_TRANSITION_SCENES[kapyTransitionSceneIndex(runId)];
}
