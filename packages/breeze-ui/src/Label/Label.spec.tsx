import { render } from '@testing-library/react';
import React from 'react';
import Label from './Label';

describe('Label', () => {
  describe('when not active', () => {
    it('should have the correct colour when no error is set', () => {
      const { container } = render(
        <Label active={false} error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: #aaa;');
    });

    it('should have the correct colour when an error is set', () => {
      const { container } = render(
        <Label active={false} error>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: rgb(199,56,79);');
    });

    it('should be displayed correctly', () => {
      const { container } = render(
        <Label active={false} error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle(
        'transform: translate(0,16px) scale(1);',
      );
    });
  });

  describe('when active', () => {
    it('should have the correct colour when no error is set', () => {
      const { container } = render(
        <Label active error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: #2e9dc8;');
    });

    it('should have the correct colour when an error is set', () => {
      const { container } = render(
        <Label active error>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: rgb(199,56,79);');
    });

    it('should be displayed correctly', () => {
      const { container } = render(
        <Label active error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle(
        'transform: translate(0,4px) scale(.75);',
      );
    });
  });
});
