import { render } from '@testing-library/react';
import React from 'react';
import AppBar from '../AppBar';

describe('AppBar', () => {
  it('should render the primary theme by default', () => {
    const { container } = render(
      <AppBar>
        <div data-testid="content">Hello</div>
      </AppBar>,
    );

    expect(container.firstChild).toHaveStyle(`
      background-color: #161616;
      color: #fff;
    `);
  });

  it('should render the primary theme', () => {
    const { container } = render(
      <AppBar colour="primary">
        <div data-testid="content">Hello</div>
      </AppBar>,
    );

    expect(container.firstChild).toHaveStyle(`
      background-color: #161616;
      color: #fff;
    `);
  });

  it('should render the secondary theme', () => {
    const { container } = render(
      <AppBar colour="secondary">
        <div data-testid="content">Hello</div>
      </AppBar>,
    );

    expect(container.firstChild).toHaveStyle(`
      background-color: #f6f9fc;
      color: #333;
    `);
  });

  it('should render the inner content', async () => {
    const { findByTestId } = render(
      <AppBar>
        <div data-testid="content">Hello</div>
      </AppBar>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });

  it('should render as a header element by default', () => {
    const { container } = render(
      <AppBar>
        <div data-testid="content">Hello</div>
      </AppBar>,
    );
    const header = container.querySelector('header');

    expect(header).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <AppBar element="div">
        <div data-testid="content">Hello</div>
      </AppBar>,
    );
    const div = container.querySelector('div[class]');

    expect(div).toBeInTheDocument();
  });
});
