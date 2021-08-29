import { Placement } from '@popperjs/core';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

export interface ITooltipProps {
  className?: string;
  colour?: TTheme;
  id: string;
  message: ReactNode;
  parent: ReactNode;
  placement?: Placement;
}

const arrowClass = (placement?: Placement) => {
  if (placement) {
    if (placement.startsWith('top')) {
      return '-bottom-1';
    }

    if (placement.startsWith('bottom')) {
      return '-top-1';
    }

    if (placement.startsWith('left')) {
      return '-right-1';
    }

    return '-left-1';
  }

  return '';
};

const Tooltip: FC<ITooltipProps> = ({
  className = 'inline-block',
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
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>();
  const { attributes, state, styles } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowElement,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
      placement,
      strategy: 'fixed',
    },
  );
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
        className={className}
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        ref={setReferenceElement}
      >
        {parent}
      </div>

      {/* @tailwind: bg-blue-600 bg-gray-100 bg-green-600 bg-red-600 bg-yellow-600 */}
      {/* @tailwind: border-blue-700 border-gray-200 border-green-700 border-red-700 border-yellow-700 */}
      {visible && (
        <div
          id={id}
          className={classNames(
            'px-1 text-sm font-display border-b-2',
            themeClass(colour, 'bg-{theme}-600 border-{theme}-700 text-white', {
              secondary: 'bg-{theme}-100 border-{theme}-200 text-gray-600',
            }),
          )}
          ref={setPopperElement}
          role="tooltip"
          style={styles.popper}
          {...attributes.popper}
        >
          <p className="whitespace-nowrap">{message}</p>

          {/* @tailwind: before:bg-blue-600 before:bg-gray-100 before:bg-green-600 before:bg-red-600 before:bg-yellow-600 */}
          <div
            className={classNames(
              'absolute w-2 h-2 invisible before:absolute before:w-2 before:h-2 before:visible before:rotate-45',
              arrowClass(state?.placement),
              themeClass(colour, 'bg-{theme}-600 before:bg-{theme}-600', {
                secondary: 'bg-{theme}-100 before:bg-{theme}-600',
              }),
            )}
            ref={setArrowElement}
            style={styles.arrow}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;
