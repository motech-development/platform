import { render } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('App', () => {
  it('should render', () => {
    const { container } = render(<App />);

    expect(container).toBeInTheDocument();
  });
});
