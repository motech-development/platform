import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import Calendar from '../Calendar';

describe('Calendar', () => {
  let component: RenderResult;
  let onDateChange: jest.Mock;

  beforeEach(() => {
    onDateChange = jest.fn();
  });

  describe('with a date selected', () => {
    let selectedDate: string;

    beforeEach(() => {
      selectedDate = '2020-04-30T05:00:00Z';

      component = render(
        <Calendar
          id="test"
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />,
      );
    });

    it('should show the correct month and year', () => {
      const { container } = component;
      const label = container.querySelector('#test-dialog-label');

      expect(label).toHaveTextContent('April 2020');
    });

    it('should show the days of the week', async () => {
      const { findAllByRole } = component;
      const days = await findAllByRole('columnheader');

      expect(days[0]).toHaveTextContent('Mon');
      expect(days[1]).toHaveTextContent('Tue');
      expect(days[2]).toHaveTextContent('Wed');
      expect(days[3]).toHaveTextContent('Thu');
      expect(days[4]).toHaveTextContent('Fri');
      expect(days[5]).toHaveTextContent('Sat');
      expect(days[6]).toHaveTextContent('Sun');
    });

    it('should go back a year', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Previous year');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('April 2019');
    });

    it('should go back a month', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Previous month');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('March 2020');
    });

    it('should go forward a month', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Next month');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('May 2020');
    });

    it('should go forward a year', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Next year');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('April 2021');
    });

    it('should select the correct date', async () => {
      const { findAllByText } = component;

      await act(async () => {
        const [button] = await findAllByText('3');

        fireEvent.click(button);
      });

      expect(onDateChange).toHaveBeenCalledWith('2020-04-03T05:00:00Z');
    });
  });

  describe('with no date selected', () => {
    beforeAll(() => {
      advanceTo('2015-06-06T19:45:00Z');
    });

    beforeEach(() => {
      component = render(<Calendar id="test" onDateChange={onDateChange} />);
    });

    afterAll(() => {
      clear();
    });

    it('should show the correct month and year', () => {
      const { container } = component;
      const label = container.querySelector('#test-dialog-label');

      expect(label).toHaveTextContent('June 2015');
    });

    it('should show the days of the week', async () => {
      const { findAllByRole } = component;
      const days = await findAllByRole('columnheader');

      expect(days[0]).toHaveTextContent('Mon');
      expect(days[1]).toHaveTextContent('Tue');
      expect(days[2]).toHaveTextContent('Wed');
      expect(days[3]).toHaveTextContent('Thu');
      expect(days[4]).toHaveTextContent('Fri');
      expect(days[5]).toHaveTextContent('Sat');
      expect(days[6]).toHaveTextContent('Sun');
    });

    it('should go back a year', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Previous year');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('June 2014');
    });

    it('should go back a month', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Previous month');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('May 2015');
    });

    it('should go forward a month', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Next month');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('July 2015');
    });

    it('should go forward a year', async () => {
      const { container, findByLabelText } = component;
      const label = container.querySelector('#test-dialog-label');

      await act(async () => {
        const button = await findByLabelText('Next year');

        fireEvent.click(button);
      });

      expect(label).toHaveTextContent('June 2016');
    });

    it('should select the correct date', async () => {
      const { findAllByText } = component;

      await act(async () => {
        const [button] = await findAllByText('3');

        fireEvent.click(button);
      });

      expect(onDateChange).toHaveBeenCalledWith('2015-06-03T19:45:00Z');
    });
  });
});
