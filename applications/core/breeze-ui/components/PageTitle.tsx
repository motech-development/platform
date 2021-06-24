import { FC } from 'react';
import Typography from './Typography';

type TColour = 'primary' | 'secondary';

const styles = (colour: TColour) => {
  let colourStyles: string;

  if (colour === 'primary') {
    colourStyles = 'bg-gray-900';
  } else {
    colourStyles = 'bg-gray-200';
  }

  return colourStyles;
};

const PageTitle: FC<{
  colour?: TColour;
  subTitle?: string;
  title: string;
}> = ({ colour = 'primary', subTitle, title }) => (
  <header className={`pb-36 -mb-36 ${styles(colour)}`}>
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Typography component="h2" variant="h2" margin="sm">
        <span className="decoration-clone bg-blue-600 text-gray-100 p-1">
          {title}
        </span>
      </Typography>

      {subTitle && (
        <Typography component="p" variant="lead" margin="none">
          <span className="decoration-clone bg-gray-100 text-gray-900 p-1">
            {subTitle}
          </span>
        </Typography>
      )}
    </div>
  </header>
);

export default PageTitle;
