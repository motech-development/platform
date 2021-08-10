import { FC, ReactNode } from 'react';
import TSpacing from '../utils/spacing';

type TComponent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

type TVariant = TComponent | 'lead';

export interface ITypographyProps {
  align?: 'left' | 'right' | 'center';
  breakWord?: boolean;
  children: ReactNode;
  className?: string;
  component: TComponent;
  id?: string;
  margin?: TSpacing;
  rule?: boolean;
  truncate?: boolean;
  variant: TVariant;
}

// {
//   align = 'left',
//   breakWord = false,
//   children,
//   className = '',
//   component,
//   id,
//   margin = 'md',
//   rule = false,
//   truncate = false,
//   variant,
// }
const Typography: FC<ITypographyProps> = () => <div />;

export default Typography;
