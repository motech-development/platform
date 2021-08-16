import { FC } from 'react';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';
import Typography from './Typography';

export interface IPageTitleProps {
  colour?: TTheme;
  subTitle?: string;
  title: string;
}

const PageTitle: FC<IPageTitleProps> = ({
  colour = 'primary',
  subTitle,
  title,
}) => (
  <>
    <Typography component="h2" variant="h2" margin="sm">
      {/* @tailwind: bg-blue-600 bg-gray-600 bg-green-600 bg-red-600 bg-yellow-600 */}
      <span
        className={classNames(
          'decoration-clone text-gray-100 px-2 py-1',
          themeClass(colour, 'bg-{theme}-600'),
        )}
      >
        {title}
      </span>
    </Typography>

    {subTitle && (
      <Typography component="p" variant="lead" margin="none">
        <span className="decoration-clone bg-gray-100 text-gray-900 px-2 py-1">
          {subTitle}
        </span>
      </Typography>
    )}
  </>
);

export default PageTitle;
