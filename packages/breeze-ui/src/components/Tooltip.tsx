import { Placement } from '@popperjs/core';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

export interface ITooltipProps {
  colour?: TTheme;
  id: string;
  message: ReactNode;
  parent: ReactNode;
  placement?: Placement;
}

const Tooltip: FC<ITooltipProps> = ({
  colour = 'primary',
  message,
  id,
  parent,
  placement = 'auto',
}) => {
  let timer: ReturnType<typeof setTimeout>;
  const mounted = useRef(false);
  const [visible, setVisibility] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
    placement,
  });
  const hideTooltip = () => {
    timer = setTimeout(() => {
      if (mounted.current) {
        setVisibility(false);
      }
    }, 1000);
  };
  const showTooltip = () => {
    clearTimeout(timer);

    setVisibility(true);
  };

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <>
      <div
        className="inline-block"
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        ref={setReferenceElement}
      >
        {parent}
      </div>

      {/* @tailwind: bg-blue-600 bg-gray-100 bg-green-600 bg-red-600 bg-yellow-600 */}
      {visible && (
        <div
          id={id}
          className={classNames(
            'p-1 text-sm font-display rounded-sm',
            themeClass(colour, 'bg-{theme}-600 text-white', {
              secondary: 'bg-{theme}-100 text-gray-600',
            }),
          )}
          ref={setPopperElement}
          role="tooltip"
          style={styles.popper}
          {...attributes.popper}
        >
          <p className="whitespace-nowrap">{message}</p>
        </div>
      )}
    </>
  );
};

export default Tooltip;
