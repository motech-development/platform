import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { FC } from 'react';

type TType = 'email' | 'number' | 'password' | 'text';

const TextBox: FC<{
  error?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  type?: TType;
}> = ({ error = false, label, name, placeholder, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
      {label}
    </label>

    <div className="mt-1 relative shadow-sm">
      <input
        id={name}
        className="focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300"
        type={type}
        name={name}
        placeholder={placeholder}
        data-lpignore="true"
      />

      {error && (
        <div className="text-white text-sm absolute inset-y-0 right-0 flex items-center">
          <div
            className="absolute right-11 top-2.5 bg-red-600 border-b-2 border-red-700 px-1"
            role="tooltip"
          >
            <p className="whitespace-nowrap">Email address is required</p>

            <div className="absolute -right-1 top-2 h-0 w-0 border-4 border-r-0 border-b-transparent border-t-transparent border-red-600" />
          </div>

          <div
            className="flex mx-4 text-red-600 items-center justify-center"
            role="alert"
          >
            <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default TextBox;
