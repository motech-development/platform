import { render } from '@testing-library/react';
import React from 'react';
import Label from '../Label';

describe('Label', () => {
  describe('when not active', () => {
    it('should have the correct colour when no error is set', () => {
      const { container } = render(
        <Label active={false} error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: #767676;');
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

    it('should have the correct pointer event', () => {
      const { container } = render(
        <Label active={false} error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('pointer-events: none;');
    });
  });

  describe('when active', () => {
    it('should have the correct colour when no error is set', () => {
      const { container } = render(
        <Label active error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('color: #007fa8;');
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

    it('should have the correct pointer event', () => {
      const { container } = render(
        <Label active error={false}>
          Test
        </Label>,
      );

      expect(container.firstChild).toHaveStyle('pointer-events: none;');
    });
  });
});
