import { FC, SVGProps } from 'react';

export interface ILogoProps extends SVGProps<SVGSVGElement> {
  alt: string;
}

const Logo: FC<ILogoProps> = ({ alt, ...rest }) => (
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

export default Logo;
