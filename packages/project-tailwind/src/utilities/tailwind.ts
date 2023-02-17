import clsx, { ClassValue } from 'clsx';

/** Alignment options */
export enum Alignment {
  /** Centre */
  CENTRE = 'centre',
  /** Left */
  LEFT = 'left',
  /** Right */
  RIGHT = 'right',
}

/** Alignment type */
export type TAlignment = `${Alignment}`;

/** Sizing options */
export enum Sizing {
  /** Large */
  LG = 'lg',
  /** Medium */
  MD = 'md',
  /** None */
  NONE = 'none',
  /** Small */
  SM = 'sm',
}

/** Sizing type */
export type TSizing = `${Sizing}`;

/** Theming options */
export enum Themes {
  /** Danger */
  DANGER = 'danger',
  /** Primary */
  PRIMARY = 'primary',
  /** Secondary */
  SECONDARY = 'secondary',
  /** Success */
  SUCCESS = 'success',
  /** Warning */
  WARNING = 'warning',
}

/** Theme type */
export type TTheme = `${Themes}`;

/** Class names options */
type TCreateStylesClassNames = {
  /** Universal classes to apply */
  classNames?: ClassValue[];
  /** Sizing specific classes */
  sizing?: {
    [name in Sizing]?: ClassValue[];
  };
  /** Theme specific classes */
  theme?: {
    [name in TTheme]?: ClassValue[];
  };
};

/**
 * Tailwind hook
 *
 * @param theme - The theme to apply
 * @param sizing - Sizing to apply
 *
 * @returns Tailwind helper utilities
 */
export function useTailwind(theme: TTheme, sizing: TSizing) {
  /**
   * Creates css styles to apply
   *
   * @param classNames - Classes to be applied
   *
   * @returns Class names
   */
  function createStyles(classNames: TCreateStylesClassNames) {
    let finalStyles: ClassValue[] = [];

    if (classNames.classNames) {
      finalStyles = [...classNames.classNames];
    }

    if (sizing && classNames.sizing) {
      const styles = classNames.sizing[sizing];

      if (!styles) {
        throw new Error('No classes defined for this sizing.');
      }

      finalStyles = [...finalStyles, ...styles];
    }

    if (theme && classNames.theme) {
      const styles = classNames.theme[theme];

      if (!styles) {
        throw new Error('No classes defined for this theme.');
      }

      finalStyles = [...finalStyles, ...styles];
    }

    return clsx(finalStyles);
  }

  /**
   * Creates text alignment classes
   *
   * @param alignment - Text alignment
   *
   * @returns Class names
   */
  function createTextAlignmentStyles(alignment: TAlignment) {
    switch (alignment) {
      case Alignment.CENTRE:
        return 'text-center';
      case Alignment.RIGHT:
        return 'text-right';
      case Alignment.LEFT:
      default:
        return 'text-left';
    }
  }

  return {
    createStyles,
    createTextAlignmentStyles,
  };
}
