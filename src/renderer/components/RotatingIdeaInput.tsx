import {
  forwardRef,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from 'react';

import { useRotatingPrompt } from '../useRotatingPrompt';

interface RotatingIdeaInputProps {
  value: string;
  busy: boolean;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
}

export const RotatingIdeaInput = forwardRef<HTMLTextAreaElement, RotatingIdeaInputProps>(
  function RotatingIdeaInput({ value, busy, disabled = false, onChange, onKeyDown }, ref) {
    const prompt = useRotatingPrompt({ paused: value.length > 0 || busy || disabled });
    return (
      <textarea
        ref={ref}
        className={prompt.isEasterEgg ? 'is-easter-egg' : undefined}
        value={value}
        rows={4}
        maxLength={12_000}
        disabled={disabled}
        aria-label="描述你想制作的游戏"
        placeholder={prompt.text}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    );
  },
);
