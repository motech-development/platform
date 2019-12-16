import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  let tooltip: HTMLElement;

  describe('primary', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="top"
          message="Hello"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: #2e9dc8;
        color: #fff;
      `);
    });

    it('should display content', () => {
      expect(tooltip.firstChild.textContent).toEqual('Hello');
    });
  });

  describe('danger', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="top"
          message="Hello"
          colour="danger"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: rgb(199,56,79);
        color: #fff;
      `);
    });
  });

  describe('top', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="top"
          message="Hello"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle('margin-bottom: 5px;');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #2e9dc8;
        bottom: -5px;
      `);
    });
  });

  describe('bottom', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="bottom"
          message="Hello"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle('margin-top: 5px;');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid #2e9dc8;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        top: -5px;
      `);
    });
  });

  describe('left', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="left"
          message="Hello"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle('margin-right: 5px;');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid transparent;
        border-left: 5px solid #2e9dc8;
        border-top: 5px solid transparent;
        right: -5px;
      `);
    });
  });

  describe('right', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          parent={() => (
            <button type="button" data-testid="button">
              Hello world
            </button>
          )}
          placement="right"
          message="Hello"
        />,
      );

      const button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle('margin-left: 5px;');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid transparent;
        border-right: 5px solid #2e9dc8;
        border-top: 5px solid transparent;
        left: -5px;
      `);
    });
  });
});
