import { FC } from 'react';
import IOption from '../utils/option';
import { ITextBoxProps } from './TextBox';

export interface ITypeaheadProps
  extends Omit<ITextBoxProps, 'type' | 'onChange'> {
  suggestions: IOption[];
}

// { suggestions, ...rest }
const Typeahead: FC<ITypeaheadProps> = () => <div />;

export default Typeahead;
