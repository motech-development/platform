import { render } from '@testing-library/react';
import React from 'react';
import Overlay from '../Overlay';

describe('Overlay', () => {
  it('should render with the correct styles', () => {
    const { container } = render(<Overlay />);

    expect(container.firstChild).toHaveStyle(`
      background: rgba(0, 0, 0, 0.5);
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 1000;
    `);
  });
});
