import { createElement, FC, ReactNode } from 'react';

type TElement = 'header' | 'div' | 'nav';

type TColour = 'primary' | 'secondary';

const parentStyles = (colour: TColour, fixed: boolean) => {
  let colourStyles: string;
  let positionStyles: string;

  if (colour === 'primary') {
    colourStyles = 'bg-gray-900 text-gray-100';
  } else {
    colourStyles = 'bg-gray-200 text-gray-700';
  }

  if (fixed) {
    positionStyles = 'fixed';
  } else {
    positionStyles = 'relative';
  }

  return `${colourStyles} ${positionStyles}`;
};

const innerStyles = (colour: TColour) =>
  colour === 'primary' ? 'border-gray-800' : 'border-gray-300';

const Parent: FC<{
  children: ReactNode;
  colour: TColour;
  element: TElement;
  fixed: boolean;
}> = ({ children, colour, element, fixed }) =>
  createElement(
    element,
    {
      className: parentStyles(colour, fixed),
    },
    children,
  );

const AppBar: FC<{
  children: ReactNode;
  colour?: TColour;
  element?: TElement;
  fixed?: boolean;
}> = ({ children, colour = 'primary', element = 'header', fixed = false }) => {
  return (
    <Parent colour={colour} element={element} fixed={fixed}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-16 border-b-2 ${innerStyles(
            colour,
          )}`}
        >
          {children}
        </div>
      </div>
    </Parent>
  );
};

export default AppBar;
