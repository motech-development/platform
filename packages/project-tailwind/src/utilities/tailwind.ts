import clsx from 'clsx';

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
  classNames?: string[];
  /** Sizing specific classes */
  sizing?: {
    [name in Sizing]?: string[];
  };
  /** Theme specific classes */
  theme?: {
    [name in TTheme]?: string[];
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
    let finalStyles: string[] = [];

    if (classNames.classNames) {
      finalStyles = [...finalStyles, ...classNames.classNames];
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

  return {
    createStyles,
  };
}
