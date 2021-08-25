import { act, fireEvent, render } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  let button: HTMLElement;
  let tooltip: HTMLElement;

  describe('visibility', () => {
    it('should hide after 1000ms', async () => {
      const { findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      jest.useFakeTimers();

      fireEvent.blur(button);

      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });

    it('should hide the tooltip', async () => {
      jest.useFakeTimers();

      const { findByTestId, queryByRole } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      expect(queryByRole('tooltip')).toBeDefined();

      fireEvent.blur(button);

      act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(queryByRole('tooltip')).toBeNull();
    });
  });

  describe('primary', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toMatchSnapshot();
    });

    it('should display content', () => {
      const { textContent } = tooltip.firstChild as ChildNode;

      expect(textContent).toEqual('Hello');
    });
  });

  describe('danger', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="danger"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toMatchSnapshot();
    });
  });

  describe('secondary', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="secondary"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toMatchSnapshot();
    });
  });

  describe('success', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="success"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toMatchSnapshot();
    });
  });

  describe('warning', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="warning"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toMatchSnapshot();
    });
  });
});
