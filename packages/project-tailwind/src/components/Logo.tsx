import { ComponentPropsWithRef } from 'react';

/** Logo component properties */
export interface ILogoProps extends ComponentPropsWithRef<'svg'> {
  /** Alternative information text */
  alt: string;
}

/**
 * Motech Development logo
 *
 * @param props - Component props
 *
 * @returns Logo component
 */
export function Logo({ alt, ...rest }: ILogoProps) {
  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 345.21 398.61"
      aria-labelledby="logo-alt-text"
    >
      <title id="logo-alt-text">{alt}</title>
      <polygon
        className="fill-current"
        points="172.6 199.31 57.53 132.87 57.53 332.18 0 298.96 0 99.65 172.6 0 345.21 99.65 345.21 298.96 287.67 332.18 287.67 132.87 172.6 199.31"
      />
      <polygon
        className="fill-current"
        points="115.07 365.39 115.07 232.53 172.6 265.74 230.14 232.53 230.14 365.39 172.6 398.61 115.07 365.39"
      />
    </svg>
  );
}
