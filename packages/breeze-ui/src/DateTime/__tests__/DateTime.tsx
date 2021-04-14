import { render, RenderResult } from '@testing-library/react';
import DateTime from '../DateTime';

describe('DateTime', () => {
  let component: RenderResult;
  let value: string | number;

  describe('with the default format', () => {
    beforeEach(() => {
      value = '2020-01-25T14:58:21+0000';

      component = render(<DateTime value={value} />);
    });

    it('should have the correct value', () => {
      const { container } = component;
      const time = container.querySelector('time');

      expect(time).toHaveTextContent('25/01/2020');
    });

    it('should have the correct date-time attribute', () => {
      const { container } = component;
      const time = container.querySelector('time');

      expect(time).toHaveAttribute('datetime', '2020-01-25T14:58:21.000+00:00');
    });
  });

  describe('with a custom format', () => {
    let format: string;

    beforeEach(() => {
      value = 1579964301;

      format = 'dd/MM/yyyy HH:mm';

      component = render(<DateTime value={value} format={format} />);
    });

    it('should have the correct value', () => {
      const { container } = component;
      const time = container.querySelector('time');

      expect(time).toHaveTextContent('25/01/2020 14:58');
    });

    it('should have the correct date-time attribute', () => {
      const { container } = component;
      const time = container.querySelector('time');

      expect(time).toHaveAttribute('datetime', '2020-01-25T14:58:21.000+00:00');
    });
  });
});
