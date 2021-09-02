import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { FC } from 'react';
import Tooltip from './Tooltip';

export interface IInputValidation {
  errorMessage: string;
  id: string;
}

const InputValidation: FC<IInputValidation> = ({ errorMessage, id }) => (
  <Tooltip
    id={id}
    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
    colour="danger"
    message={errorMessage}
    parent={
      <ExclamationCircleIcon
        className="h-5 w-5 text-red-500"
        aria-hidden="true"
      />
    }
    placement="left"
  />
);

export default InputValidation;
