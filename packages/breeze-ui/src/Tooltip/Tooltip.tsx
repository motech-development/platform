import React, { ElementType, FC, memo, ReactNode, useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled, { ThemeProvider } from 'styled-components';

interface ITooltipTheme {
  [name: string]: {
    background: string;
    colour: string;
  };
}

const tooltipTheme: ITooltipTheme = {
  danger: {
    background: 'rgb(199,56,79)',
    colour: '#fff',
  },
  primary: {
    background: '#2e9dc8',
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
  colour: keyof typeof tooltipTheme;
  placement: TooltipPlacement;
}

const TooltipArrow = styled.div<ITooltipPlacement>`
  ${({ colour, placement, theme }) => `
    height: 0;
    position: absolute;
    width: 0;

    ${(() => {
      switch (placement) {
        case 'bottom':
          return `
            border-bottom: 5px solid ${theme[colour].background};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            top: -5px;
          `;
        case 'left':
          return `
            border-bottom: 5px solid transparent;
            border-left: 5px solid ${theme[colour].background};
            border-top: 5px solid transparent;
            right: -5px;
          `;
        case 'right':
          return `
            border-bottom: 5px solid transparent;
            border-right: 5px solid ${theme[colour].background};
            border-top: 5px solid transparent;
            left: -5px;
          `;
        case 'top':
          return `
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid ${theme[colour].background};
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
  visible: boolean;
}

const TooltipContent = styled.div<ITooltipContent>`
  ${({ colour, placement, theme, visible }) => `
    background-color: ${theme[colour].background};
    color: ${theme[colour].colour};
    font-size: 14px;
    line-height: 22px;
    padding: 0 5px;
    visibility: ${visible ? 'visible' : 'hidden'};

    ${(() => {
      switch (placement) {
        case 'bottom':
          return `
            margin-top: 5px;
          `;
        case 'left':
          return `
            margin-right: 5px;
          `;
        case 'right':
          return `
            margin-left: 5px;
          `;
        case 'top':
          return `
            margin-bottom: 5px;
          `;
        default:
          return '';
      }
    })()}
  `}
`;

export interface ITooltipProps {
  colour?: keyof typeof tooltipTheme;
  id: string;
  message: ReactNode;
  parent: ElementType;
  placement: TooltipPlacement;
}

const Tooltip: FC<ITooltipProps> = ({
  colour = 'primary',
  message,
  id,
  parent: Parent,
  placement,
}) => {
  const [visible, setVisibility] = useState(false);
  let timer: number;

  function hideTooltip() {
    timer = setTimeout(() => {
      setVisibility(false);
    }, 1000);
  }

  function showTooltip() {
    clearTimeout(timer);
    setVisibility(true);
  }

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
              <Parent />
            </TooltipWrapper>
          )}
        </Reference>

        <Popper placement={placement} positionFixed>
          {({ arrowProps, placement: popperPlacement, ref, style }) => {
            const placementToUse =
              process.env.NODE_ENV === 'test' ? placement : popperPlacement;

            return (
              <TooltipContent
                id={id}
                role="tooltip"
                visible={visible}
                ref={ref}
                colour={colour}
                style={style}
                placement={placementToUse}
              >
                {message}
                <TooltipArrow
                  ref={arrowProps.ref}
                  colour={colour}
                  style={arrowProps.style}
                  placement={placementToUse}
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
