import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { sizing, themes } from '../../utilities/jest';
import { Alert } from '../Alert';

describe('Alert', () => {
  describe('dismiss', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should call callback function when dismissed', async () => {
      const onDismiss = jest.fn();

      const { findByText } = render(
        <Alert dismissable message="Hello, world" onDismiss={onDismiss} />,
      );

      const button = await findByText(/Dismiss/);

      fireEvent.click(button);

      await waitFor(() => expect(onDismiss).toHaveBeenCalledWith());
    });

    it('should dismiss an alert', async () => {
      const { asFragment, findByText } = render(
        <Alert dismissable message="Hello, world" />,
      );

      await act(async () => {
        const button = await findByText(/Dismiss/);

        fireEvent.click(button);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should automatically dismiss an alert', () => {
      const { asFragment } = render(
        <Alert dismissable={1000} message="Hello, world" />,
      );

      act(() => jest.advanceTimersByTime(1000));

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe.each(themes)('$theme', ({ theme }) => {
    it('should be dismissable', () => {
      const { asFragment } = render(
        <Alert dismissable message="Hello, world" theme={theme} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should set custom dismiss text', () => {
      const { asFragment } = render(
        <Alert
          dismissable
          dismissText="Close me!"
          message="Hello, world"
          theme={theme}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should display an icon', () => {
      const { asFragment } = render(
        <Alert
          icon={<ExclamationTriangleIcon />}
          message="Hello, world"
          theme={theme}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it.each(sizing)(
      'should render the correct output when spacing is $size',
      ({ size }) => {
        const { asFragment } = render(
          <Alert message="Hello, world" spacing={size} theme={theme} />,
        );

        expect(asFragment()).toMatchSnapshot();
      },
    );
  });
});
