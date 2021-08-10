import { FC, ReactNode } from 'react';
import TSpacing from '../utils/spacing';

export interface ICardProps {
  children: ReactNode;
  padding?: TSpacing;
}

// { children, padding = 'md' }
const Card: FC<ICardProps> = () => <div />;

export default Card;
