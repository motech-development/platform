import React, { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled, { ThemeProvider } from 'styled-components';

const tooltipTheme = {
  danger: {
    background: 'rgb(199,56,79)',
    colour: '#fff',
  },
  primary: {
    background: '#007fa8',
    colour: '#fff',
  },
  secondary: {
    background: '#f6f9fc',
    colour: '#333',
  },
  success: {
    background: 'rgb(0,128,93)',
    colour: '#fff',
  },
};

type TooltipPlacement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

interface ITooltipPlacement {
  $colour: keyof typeof tooltipTheme;
  $placement: TooltipPlacement;
}

const TooltipArrow = styled.div<ITooltipPlacement>`
  ${({ $colour, $placement, theme }) => `
    height: 0;
    position: absolute;
    width: 0;

    ${(() => {
      switch ($placement) {
        case 'bottom':
          return `
            border-bottom: 5px solid ${theme[$colour].background};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            top: -5px;
          `;
        case 'left':
          return `
            border-bottom: 5px solid transparent;
            border-left: 5px solid ${theme[$colour].background};
            border-top: 5px solid transparent;
            right: -5px;
          `;
        case 'right':
          return `
            border-bottom: 5px solid transparent;
            border-right: 5px solid ${theme[$colour].background};
            border-top: 5px solid transparent;
            left: -5px;
          `;
        case 'top':
          return `
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid ${theme[$colour].background};
            bottom: -5px;
          `;
        default:
          return '';
      }
    })()}
  `}
`;

const TooltipWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

interface ITooltipContent extends ITooltipPlacement {
  $visible: boolean;
}

const TooltipContent = styled.div<ITooltipContent>`
  ${({ $colour, $visible, theme }) => `
    background-color: ${theme[$colour].background};
    color: ${theme[$colour].colour};
    font-size: 14px;
    line-height: 22px;
    padding: 0 5px;
    visibility: ${$visible ? 'visible' : 'hidden'};
  `}
`;

export interface ITooltipProps {
  colour?: keyof typeof tooltipTheme;
  id: string;
  message: ReactNode;
  parent: ReactNode;
  placement: TooltipPlacement;
}

const Tooltip: FC<ITooltipProps> = ({
  colour = 'primary',
  message,
  id,
  parent,
  placement,
}) => {
  let timer: number;
  const [visible, setVisibility] = useState(false);
  const mounted = useRef(false);
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
  });

  return (
    <ThemeProvider theme={tooltipTheme}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <TooltipWrapper
              ref={ref}
              onBlur={hideTooltip}
              onFocus={showTooltip}
              onMouseOver={showTooltip}
              onMouseOut={hideTooltip}
            >
              {parent}
            </TooltipWrapper>
          )}
        </Reference>

        <Popper
          placement={placement}
          strategy="fixed"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 5],
              },
            },
          ]}
        >
          {({ arrowProps, placement: popperPlacement, ref, style }) => {
            const placementToUse =
              process.env.NODE_ENV === 'test' ? placement : popperPlacement;

            return (
              <TooltipContent
                $placement={placementToUse}
                $visible={visible}
                id={id}
                role="tooltip"
                ref={ref}
                $colour={colour}
                style={style}
              >
                {message}
                <TooltipArrow
                  $placement={placementToUse}
                  ref={arrowProps.ref}
                  $colour={colour}
                  style={arrowProps.style}
                />
              </TooltipContent>
            );
          }}
        </Popper>
      </Manager>
    </ThemeProvider>
  );
};

export default memo(Tooltip);
