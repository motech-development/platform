import {
  arrow,
  autoUpdate,
  flip,
  MiddlewareData,
  offset,
  Placement,
  shift,
  Side,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Themes, TTheme, useTailwind } from '../utilities/tailwind';

/** Default legth of time to display tooltip after moving away from parent */
const DEFAULT_TIME = 1000;

/** Arrow box dimension */
const BOX_SIZE = 8;

/** Arrow box's hypotenuse length */
const FLOATING_OFFSET = Math.sqrt(2 * BOX_SIZE ** 2) / 2;

/**
 * Creates inline styles for arrows
 *
 * @param element - Arrow from middleware
 *
 * @param placement - Arrow placement
 *
 * @returns Arrow inline styles
 */
function createArrowStyles(
  element: MiddlewareData['arrow'],
  placement: Placement,
) {
  let styles = {
    bottom: '',
    left: '',
    right: '',
    top: '',
  };

  if (element) {
    const { x, y } = element;

    const side = placement.split('-')[0];

    /** Position to apply generated style */
    const xy = {
      bottom: 'top',
      left: 'right',
      right: 'left',
      top: 'bottom',
    }[side] as string;

    styles = {
      ...styles,
      left: xy === 'right' ? '' : `${x ?? BOX_SIZE}px`,
      top: xy === 'bottom' ? '' : `${y ?? BOX_SIZE}px`,
      [xy]: -BOX_SIZE / 2,
    };
  }

  return styles;
}

/** Tooltip component properties */
export interface ITooltipProps extends ComponentPropsWithoutRef<'div'> {
  /** Content to be displayed */
  content: ReactNode;

  /** Callback trigger when tooltop is shown or hidden  */
  onVisibilityChange?: (value: boolean) => void;

  /** Element to output tooltip relative to */
  parent: ReactNode;

  /** Where tooltip should be placed */
  position?: Side;

  /** Length of time to keep tooltip visible in milliseconds */
  time?: number;

  /** Component theme */
  theme?: TTheme;
}

/**
 * Display information when hovering over a component
 *
 * @param props - Component props
 *
 * @returns Tooltip component
 */
export function Tooltip({
  className,
  content,
  onVisibilityChange,
  parent,
  position = 'bottom',
  time = DEFAULT_TIME,
  theme = Themes.PRIMARY,
  ...rest
}: ITooltipProps) {
  const arrowRef = useRef(null);

  const { createStyles } = useTailwind(theme);

  const [isOpen, setIsOpen] = useState(false);

  const { context, middlewareData, placement, refs, strategy, x, y } =
    useFloating({
      middleware: [
        flip(),
        offset(FLOATING_OFFSET),
        shift(),
        arrow({
          element: arrowRef,
        }),
      ],
      onOpenChange: setIsOpen,
      open: isOpen,
      placement: position,
      whileElementsMounted: autoUpdate,
    });

  const hover = useHover(context, {
    delay: {
      close: time,
    },
    move: false,
  });

  const focus = useFocus(context);

  const dismiss = useDismiss(context);

  const role = useRole(context, {
    role: 'tooltip',
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const tooltipStyles = createStyles({
    classNames: [className],
    theme: {
      danger: ['bg-red-600 text-red-50'],
      primary: ['bg-blue-600 text-blue-50'],
      secondary: ['bg-gray-100 text-gray-600'],
      success: ['bg-green-600 text-green-50'],
      warning: ['bg-yellow-600 text-yellow-50'],
    },
  });

  const innerTooltipStyles = createStyles({
    classNames: [
      'px-1 text-sm font-display whitespace-nowrap',
      {
        'border-b-2': placement === 'top',
        'border-l-2': placement === 'right',
        'border-r-2': placement === 'left',
        'border-t-2': placement === 'bottom',
      },
    ],
    theme: {
      danger: ['border-red-700'],
      primary: ['border-blue-700'],
      secondary: ['border-gray-200'],
      success: ['border-green-700'],
      warning: ['border-yellow-700'],
    },
  });

  const tooltipInlineStyles = {
    left: x ?? 0,
    position: strategy,
    top: y ?? 0,
    width: 'max-content',
  };

  const arrowStyles = createStyles({
    classNames: ['absolute w-2 h-2 rotate-45 -z-10 pointer-events-none'],
    theme: {
      danger: ['bg-red-700'],
      primary: ['bg-blue-700'],
      secondary: ['bg-gray-200'],
      success: ['bg-green-700'],
      warning: ['bg-yellow-700'],
    },
  });

  const arrowInlineStyles = createArrowStyles(middlewareData.arrow, placement);

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isOpen);
    }
  }, [isOpen, onVisibilityChange]);

  return (
    <>
      <div
        className="inline-block"
        data-testid="tooltip-parent-element"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {parent}
      </div>

      {isOpen && (
        <div
          className={tooltipStyles}
          ref={refs.setFloating}
          style={tooltipInlineStyles}
          {...getFloatingProps()}
          {...rest}
        >
          <div className={innerTooltipStyles}>{content}</div>

          <div
            className={arrowStyles}
            ref={arrowRef}
            style={arrowInlineStyles}
          />
        </div>
      )}
    </>
  );
}
