import { render, RenderResult } from '@testing-library/react';
import moment from 'moment';
import React from 'react';
import DateTime from '../DateTime';

describe('DateTime', () => {
  let component: RenderResult;
  let value: string;

  beforeEach(() => {
    value = moment('2020-01-25T14:58:21+0000').format();
  });

  describe('with the default format', () => {
    beforeEach(() => {
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

      expect(time).toHaveAttribute('datetime', '2020-01-25T14:58:21.000Z');
    });
  });

  describe('with a custom format', () => {
    let format: string;

    beforeEach(() => {
      format = 'DD/MM/YYYY HH:mm';

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

      expect(time).toHaveAttribute('datetime', '2020-01-25T14:58:21.000Z');
    });
  });
});
