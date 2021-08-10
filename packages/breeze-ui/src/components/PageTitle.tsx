import { FC } from 'react';

export interface IPageTitleProps {
  subTitle?: string;
  title: string;
}

// { subTitle, title }
const PageTitle: FC<IPageTitleProps> = () => <div />;

export default PageTitle;
