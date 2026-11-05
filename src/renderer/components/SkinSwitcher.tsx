import { UI_SKIN_IDS, type UiSkinId } from '../../shared/contracts';
import { UI_SKIN_OPTIONS } from '../ui';

/** Compact four-way skin picker shown in the toolbars in place of a light/dark toggle. */
export function SkinSwitcher({
  value,
  onChange,
  className,
}: {
  value: UiSkinId;
  onChange: (skin: UiSkinId) => void;
  className?: string;
}) {
  return (
    <div
      className={`skin-switcher${className ? ` ${className}` : ''}`}
      role="radiogroup"
      aria-label="界面皮肤"
    >
      {UI_SKIN_IDS.map((skin) => {
        const option = UI_SKIN_OPTIONS[skin];
        return (
          <button
            type="button"
            role="radio"
            aria-checked={value === skin}
            aria-label={option.label}
            title={option.label}
            className={value === skin ? 'is-active' : ''}
            key={skin}
            onClick={() => onChange(skin)}
          >
            <span className={`skin-dot skin-${skin}`} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
