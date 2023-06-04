import { Themes, TTheme, useTailwind } from '../utilities/tailwind';
import { Typography } from './Typography';

/** Title component props */
export interface ITitleProps {
  /** Component theme */
  theme?: TTheme;

  /** Subtitle text */
  subtitle?: string;

  /** Title text */
  title: string;
}

/**
 * Display screen title and subtitle
 *
 * @param props - Component props
 *
 * @returns Title component
 */
export function Title({
  theme = Themes.PRIMARY,
  subtitle,
  title,
}: ITitleProps) {
  const { createStyles } = useTailwind(theme);

  const titleStyles = createStyles({
    classNames: ['decoration-clone text-gray-100 px-2 py-1'],
    theme: {
      danger: ['bg-red-600'],
      primary: ['bg-blue-600'],
      secondary: ['bg-gray-600'],
      success: ['bg-green-600'],
      warning: ['bg-yellow-600'],
    },
  });

  const subtitleStyles = createStyles({
    classNames: ['decoration-clone bg-gray-100 text-gray-900 px-2 py-1'],
  });

  return (
    <>
      <Typography asChild margin="sm" variant="h2">
        <h2>
          <span className={titleStyles}>{title}</span>
        </h2>
      </Typography>

      {subtitle && (
        <Typography margin="sm" variant="lead">
          <span className={subtitleStyles}>{subtitle}</span>
        </Typography>
      )}
    </>
  );
}
