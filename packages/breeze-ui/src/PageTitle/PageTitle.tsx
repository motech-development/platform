import React, { FC, memo } from 'react';
import styled from 'styled-components';
import Typography from '../Typography/Typography';

const TitleWrapper = styled.div`
  background-color: #2e9dc8;
  color: #fff;
  display: inline-block;
  padding: 0.5rem 1rem 0;
`;

const SubTitleWrapper = styled.div`
  background-color: #f8f8f8;
  color: #000;
  display: inline-block;
  padding: 0.25rem 1rem;
`;

const Split = styled.hr`
  border: 0;
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

export interface IPageTitleProps {
  subTitle?: string;
  title: string;
}

const PageTitle: FC<IPageTitleProps> = ({ subTitle = null, title }) => (
  <Wrapper>
    <TitleWrapper>
      <Typography component="h2" variant="h2">
        {title}
      </Typography>
    </TitleWrapper>

    <Split />

    {subTitle && (
      <SubTitleWrapper>
        <Typography component="p" variant="lead">
          {subTitle}
        </Typography>
      </SubTitleWrapper>
    )}
  </Wrapper>
);

export default memo(PageTitle);
