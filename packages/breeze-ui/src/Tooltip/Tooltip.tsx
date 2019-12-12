import React, { ElementType, FC, memo, ReactNode } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

type ToolTipPlacement =
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

interface IToolTipPlacement {
  placement: ToolTipPlacement;
}

const ToolTipArrow = styled.div<IToolTipPlacement>`
  ${({ placement }) => `
    border: 1px solid transparent;
    height: 10px;
    position: absolute;
    transform: rotate(45deg) translate(-7px);
    width: 10px;

    ${(() => {
      switch (placement) {
        case 'bottom':
          return `
            background: linear-gradient(135deg, rgb(199, 56, 79) 50%, transparent 0%) no-repeat;
            border-left-color: rgba(0, 0, 0, .1);
            border-top-color: rgba(0, 0, 0, .1);
            margin-left: 10px;
            top: 0;
          `;
        case 'left':
          return `
            background: linear-gradient(45deg, transparent 50%, rgb(199, 56, 79) 0%) no-repeat;
            border-right-color: rgba(0, 0, 0, .1);
            border-top-color: rgba(0, 0, 0, .1);
            margin-top: 10px;
            right: -10px;
          `;
        default:
          return ``;
      }
    })()}
  `}
`;

const ToolTipWrapper = styled.div`
  margin-top: -11px;
  position: absolute;
  right: 8px;
  top: 50%;
  z-index: 1;
`;

const ToolTipContent = styled.div<IToolTipPlacement>`
  background-color: rgb(199, 56, 79);
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  margin-right: 7px;
  padding: 0 5px;
`;

export interface ITooltip {
  children: ReactNode;
  parent: ElementType;
  placement: ToolTipPlacement;
}

const Tooltip: FC<ITooltip> = ({ children, parent: Parent, placement }) => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <ToolTipWrapper ref={ref}>
          <Parent />
        </ToolTipWrapper>
      )}
    </Reference>

    <Popper placement={placement} positionFixed>
      {({ arrowProps, placement: popperPlacement, ref, style }) => (
        <ToolTipContent ref={ref} style={style} placement={popperPlacement}>
          {children}
          <ToolTipArrow
            ref={arrowProps.ref}
            style={arrowProps.style}
            placement={placement}
          />
        </ToolTipContent>
      )}
    </Popper>
  </Manager>
);

export default memo(Tooltip);
