import { FC, memo } from 'react';
import styled from 'styled-components';
import Typography from '../Typography/Typography';

const PageTitleTypography = styled(Typography)`
  line-height: 1.4;
  margin: 0 0 0.2rem;
`;

const TitleInner = styled.span`
  background-color: #007fa8;
  box-decoration-break: clone;
  color: #fff;
  display: inline;
  padding: 0.25rem 0.5rem;
`;

const SubTitleInner = styled.span`
  background-color: #f8f8f8;
  box-decoration-break: clone;
  color: #000;
  display: inline;
  padding: 0.25rem 0.5rem;
`;

const Split = styled.hr`
  border: 0;
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
  padding: 0 0.25rem 0 0;
`;

export interface IPageTitleProps {
  subTitle?: string;
  title: string;
}

const PageTitle: FC<IPageTitleProps> = ({ subTitle = null, title }) => (
  <Wrapper>
    <PageTitleTypography component="h2" variant="h2">
      <TitleInner>{title}</TitleInner>
    </PageTitleTypography>

    <Split />

    {subTitle && (
      <PageTitleTypography component="p" variant="lead" margin="none">
        <SubTitleInner>{subTitle}</SubTitleInner>
      </PageTitleTypography>
    )}
  </Wrapper>
);

export default memo(PageTitle);
