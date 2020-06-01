import { render } from '@testing-library/react';
import React from 'react';
import Loader from '../Loader';

describe('Loader', () => {
  it('should have a primary spinner by default', () => {
    const { container } = render(<Loader />);
    const loader = container.querySelector('circle');

    expect(loader).toHaveStyle('stroke: #007fa8;');
  });

  it('should have a primary spinner', () => {
    const { container } = render(<Loader colour="default" />);
    const loader = container.querySelector('circle');

    expect(loader).toHaveStyle('stroke: #007fa8;');
  });

  it('should have a secondary spinner', () => {
    const { container } = render(<Loader colour="secondary" />);
    const loader = container.querySelector('circle');

    expect(loader).toHaveStyle('stroke: #fff;');
  });
});
