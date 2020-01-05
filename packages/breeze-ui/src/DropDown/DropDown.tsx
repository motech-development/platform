import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ElementType, FC, memo, ReactNode } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';
import Button from '../Button/Button';
import Card from '../Card/Card';
import useComponentVisible from '../hooks/useComponentVisible';

interface IDropDownContent {
  visible: boolean;
}

const DropDownContent = styled.div<IDropDownContent>`
  ${({ visible }) => `
    visibility: ${visible ? 'visible' : 'hidden'};
  `}
`;

const DropDownWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const DropDownIcon = styled(FontAwesomeIcon)`
  margin-left: 0.255em;
`;

export interface IDropDownProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  trigger: ElementType;
}

const DropDown: FC<IDropDownProps> = ({
  children,
  size = 'md',
  trigger: Trigger,
}) => {
  const { ref: parentRef, setVisibility, visible } = useComponentVisible(false);
  const toggleContent = () => {
    setVisibility(!visible);
  };

  return (
    <div ref={parentRef}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <DropDownWrapper ref={ref}>
              <Button size={size} onClick={toggleContent}>
                <Trigger /> <DropDownIcon icon={faCaretDown} />
              </Button>
            </DropDownWrapper>
          )}
        </Reference>

        <Popper placement="bottom">
          {({ ref, style }) => (
            <DropDownContent visible={visible} ref={ref} style={style}>
              <Card padding="sm">{children}</Card>
            </DropDownContent>
          )}
        </Popper>
      </Manager>
    </div>
  );
};

export default memo(DropDown);
