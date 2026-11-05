import { Check, MonitorPlay } from 'lucide-react';
import React, { type KeyboardEvent } from 'react';

import type {
  KapyPackId,
  KapySceneId,
} from '../../shared/contracts';
import collaborationScene from '../assets/kapy-packs/collaboration/scene.png';
import fishingScene from '../assets/kapy-packs/fishing/four-ip-fishing.gif';
import {
  KAPY_PACK_OPTIONS,
  kapyPackGridColumnCount,
} from './KapyPackPicker';

export interface KapySceneOption<Id extends string = string> {
  id: Id;
  eyebrow: string;
  name: string;
  description: string;
  image: string;
  badges: readonly string[];
  animated: boolean;
}

export const KAPY_SOLO_SCENE_OPTIONS: readonly KapySceneOption<KapyPackId>[] =
  KAPY_PACK_OPTIONS.map((option) => ({
    id: option.id,
    eyebrow: option.eyebrow,
    name: option.name,
    description: option.sceneDescription,
    image: option.sceneImage,
    badges: ['单人工作室', '角色独立选择'],
    animated: false,
  }));

export const KAPY_SCENE_OPTIONS: readonly KapySceneOption<KapySceneId>[] = [
  {
    id: 'collaboration',
    eyebrow: 'COLLABORATION WORKSHOP',
    name: '协作工坊',
    description: '伙伴会按照岗位在策划、美术、工程与测试工位之间协作。',
    image: collaborationScene,
    badges: ['多人场景', '按编队渲染'],
    animated: false,
  },
  {
    id: 'fishing',
    eyebrow: 'POND RETREAT',
    name: '荷塘钓鱼',
    description: '流水、游鱼与随风花草组成的四人钓鱼休憩场景。',
    image: fishingScene,
    badges: ['动态循环', '固定四人'],
    animated: true,
  },
] as const satisfies readonly KapySceneOption<KapySceneId>[];

interface PickerShellProps<Id extends string> {
  value: Id | null;
  options: readonly KapySceneOption<Id>[];
  variant: 'solo' | 'multiplayer';
  disabled: boolean;
  busy: boolean;
  onChange: (sceneId: Id) => void;
}

interface KapySoloScenePickerProps {
  value: KapyPackId;
  disabled?: boolean;
  busy?: boolean;
  onChange: (sceneId: KapyPackId) => void;
}

export function KapySoloScenePicker({
  value,
  disabled = false,
  busy = false,
  onChange,
}: KapySoloScenePickerProps) {
  return (
    <KapyScenePickerShell
      value={value}
      options={KAPY_SOLO_SCENE_OPTIONS}
      variant="solo"
      disabled={disabled}
      busy={busy}
      onChange={onChange}
    />
  );
}

interface KapyScenePickerProps {
  value: KapySceneId | null;
  disabled?: boolean;
  busy?: boolean;
  onChange: (sceneId: KapySceneId) => void;
}

export function KapyScenePicker({
  value,
  disabled = false,
  busy = false,
  onChange,
}: KapyScenePickerProps) {
  return (
    <KapyScenePickerShell
      value={value}
      options={KAPY_SCENE_OPTIONS}
      variant="multiplayer"
      disabled={disabled}
      busy={busy}
      onChange={onChange}
    />
  );
}

function KapyScenePickerShell<Id extends string>({
  value,
  options,
  variant,
  disabled,
  busy,
  onChange,
}: PickerShellProps<Id>) {
  function selectAt(index: number) {
    const option = options[index];
    if (option) onChange(option.id);
  }

  function handleArrowKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const container = event.currentTarget.parentElement;
    const columnCount = kapyPackGridColumnCount(container);
    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + options.length) % options.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % options.length;
    if (event.key === 'ArrowUp') nextIndex = Math.max(0, index - columnCount);
    if (event.key === 'ArrowDown') nextIndex = Math.min(options.length - 1, index + columnCount);
    const nextButton = container?.querySelector<HTMLButtonElement>(
      `button[data-scene-index="${nextIndex}"]`,
    );
    nextButton?.focus();
    selectAt(nextIndex);
  }

  const solo = variant === 'solo';

  return (
    <section
      className={`kapy-scene-picker variant-${variant}`}
      data-scene-kind={variant}
      aria-label={solo ? 'Kapy 单人工作室' : 'Kapy 多人运行背景'}
      aria-busy={busy}
    >
      <header className="kapy-scene-heading">
        <span className="kapy-scene-heading-icon" aria-hidden="true"><MonitorPlay size={18} /></span>
        <div>
          <small>{solo ? '02 / SOLO WORKSPACE' : 'MULTIPLAYER STAGE'}</small>
          <strong>{solo ? '再选择一个单人工作室' : '最后选择多人工作的舞台'}</strong>
          <p>{solo
            ? '场景与角色互相独立；任何角色都可以进入任意一个工作室。'
            : '选择这里的任一舞台后，运行预览才会切换为多人模式。'}</p>
        </div>
      </header>

      <div
        className="kapy-scene-grid"
        role="radiogroup"
        aria-label={solo ? '选择单人工作室' : '选择多人运行背景'}
      >
        {options.map((option, index) => {
          const selected = option.id === value;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${option.name}：${option.description}；${option.badges.join('，')}`}
              className={`kapy-pack-card kapy-scene-card${selected ? ' is-selected' : ''}`}
              data-scene-id={option.id}
              data-scene-index={index}
              data-scene-kind={variant}
              data-motion={option.animated ? 'animated' : 'static'}
              disabled={disabled || busy}
              tabIndex={selected || (value === null && index === 0) ? 0 : -1}
              key={option.id}
              onKeyDown={(event) => handleArrowKey(event, index)}
              onClick={() => onChange(option.id)}
            >
              <span className="kapy-pack-preview kapy-scene-preview" aria-hidden="true">
                <img
                  className="kapy-pack-scene-image"
                  src={option.image}
                  alt=""
                  draggable={false}
                />
                <span className="kapy-scene-live-badge">
                  <i /> {solo ? 'SOLO MAP' : option.animated ? 'LIVE LOOP' : 'CREW MAP'}
                </span>
              </span>
              <span className="kapy-pack-card-copy kapy-scene-card-copy">
                <small>{option.eyebrow}</small>
                <strong>{option.name}</strong>
                <span>{option.description}</span>
                <span className="kapy-scene-card-meta" aria-hidden="true">
                  {option.badges.map((badge) => <em key={badge}>{badge}</em>)}
                </span>
              </span>
              <span className="kapy-pack-check" aria-hidden="true"><Check size={13} /></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
