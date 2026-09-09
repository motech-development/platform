import { ToggleButton } from 'react-aria-components/ToggleButton';
import { ToggleButtonGroup } from 'react-aria-components/ToggleButtonGroup';
import {
  type Appearance,
  useBreezeContext,
} from '../../provider/BreezeContext';

const variants = {
  base: {
    control:
      'breeze:flex breeze:items-center breeze:gap-breeze-2 breeze:font-breeze-sans',
    group: 'breeze:flex breeze:items-center breeze:gap-breeze-2',
    label: 'breeze:grow breeze:text-breeze-sm breeze:text-breeze-ink',
    option:
      'breeze:inline-flex breeze:items-center breeze:min-block-breeze-sm breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:rounded-breeze-full breeze:bg-breeze-surface breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink breeze:cursor-pointer breeze:outline-offset-2 breeze:data-[hovered]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
  },
  compound: {},
  size: {},
  state: {
    selected:
      'breeze:data-[selected]:border-breeze-brand breeze:data-[selected]:bg-breeze-brand-soft breeze:data-[selected]:text-breeze-brand-text breeze:forced-colors:data-[selected]:outline-2 breeze:forced-colors:data-[selected]:outline-offset-2',
  },
  variant: {},
} as const;

const appearanceOptions = [
  {
    message: 'appearanceLight',
    value: 'light',
  },
  {
    message: 'appearanceAutomatic',
    value: 'automatic',
  },
  {
    message: 'appearanceDark',
    value: 'dark',
  },
] as const;

function isAppearance(value: unknown): value is Appearance {
  return appearanceOptions.some((option) => option.value === value);
}

/**
 * Lets a person choose light, automatic or dark appearance.
 *
 * @summary A three-option appearance control backed by BreezeProvider.
 */
function AppearanceControl() {
  const { appearance, getMessageLocale, messages, setAppearance } =
    useBreezeContext();

  return (
    <div className={variants.base.control}>
      <span
        className={variants.base.label}
        lang={getMessageLocale('appearance')}
      >
        {messages.appearance}
      </span>
      <ToggleButtonGroup
        aria-label={messages.appearance}
        className={variants.base.group}
        disallowEmptySelection
        lang={getMessageLocale('appearance')}
        onSelectionChange={(keys) => {
          const [selection] = keys;

          if (isAppearance(selection)) {
            setAppearance(selection);
          }
        }}
        selectedKeys={[appearance]}
        selectionMode="single"
      >
        {appearanceOptions.map((option) => (
          <ToggleButton
            className={[variants.base.option, variants.state.selected].join(
              ' ',
            )}
            id={option.value}
            key={option.value}
            lang={getMessageLocale(option.message)}
          >
            {messages[option.message]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

export default AppearanceControl;
