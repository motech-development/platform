import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

type TType = 'email' | 'number' | 'password' | 'text';

const TextBox: FC<{
  error?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  type?: TType;
}> = ({ error = false, label, name, placeholder = ' ', type = 'text' }) => (
  <div className="relative z-0 bg-white border-b-2 mb-4 focus-within:border-blue-500">
    <div className="flex">
      <div className="flex-1">
        <input
          id={name}
          className="block px-4 pb-1 pt-5 w-full text-md bg-white appearance-none focus:outline-none bg-transparent"
          type={type}
          name={name}
          placeholder={placeholder}
          data-lpignore="true"
        />

        <label
          className="absolute top-0 text-md pointer-events-none text-gray-500 bg-white px-4 py-3 z-0 duration-300 origin-0"
          htmlFor="email-address"
        >
          {label}
        </label>
      </div>

      {error && (
        <div className="inline-flex items-center justify-center text-white text-sm">
          <div
            className="absolute right-11 top-3 bg-red-600 border-b-2 border-red-700 px-1"
            role="tooltip"
          >
            <p>Email address is required</p>

            <div className="absolute -right-1 top-2 h-0 w-0 border-4 border-r-0 border-b-transparent border-t-transparent border-red-600" />
          </div>

          <div
            className="flex rounded-full w-5 h-5 mx-4 bg-red-600 items-center justify-center"
            role="alert"
          >
            <FontAwesomeIcon icon={faExclamation} />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default TextBox;
