import { RadioGroup } from '@headlessui/react';
import { FC, useState } from 'react';

const Radio: FC<{
  label: string;
  options: {
    name: string;
    value: string;
  }[];
}> = ({ label, options }) => {
  const [selected, setSelected] = useState();

  return (
    <RadioGroup className="mb-4" value={selected} onChange={setSelected}>
      <RadioGroup.Label className="text-sm font-medium text-gray-700">
        {label}
      </RadioGroup.Label>

      <div className="flex gap-6 mt-1">
        {options.map(({ name, value }) => (
          <RadioGroup.Option
            className={({ active, checked }) =>
              `${
                active
                  ? 'ring-2 ring-offset-2 ring-offset-blue-500 ring-white'
                  : ''
              } ${
                checked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white'
              } relative shadow-md py-2 px-3 cursor-pointer flex focus:outline-none`
            }
            key={value}
            value={value}
          >
            {({ checked }) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={checked ? 'text-gray-100' : 'text-gray-900'}
                    >
                      {name}
                    </RadioGroup.Label>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default Radio;
