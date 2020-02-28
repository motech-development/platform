import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import Avatar from '../Avatar';

describe('Avatar', () => {
  let component: RenderResult;

  describe('without a width', () => {
    beforeEach(() => {
      component = render(
        <Avatar
          alt="Alt text"
          src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
        />,
      );
    });

    it('should have a wrapped with auto width', () => {
      const { container } = component;
      const wrapper = container.querySelector('div');

      expect(wrapper).toHaveStyle(`
        border-radius: 50%;
        display: inline-block;
        overflow: hidden;
        width: auto;
      `);
    });

    it('should have an image with auto width', async () => {
      const { findByAltText } = component;

      await expect(findByAltText('Alt text')).resolves.toHaveStyle(`
        display: block;
        width: auto;
      `);
    });
  });

  describe('with a width', () => {
    beforeEach(() => {
      component = render(
        <Avatar
          alt="Alt text"
          src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
          width={100}
        />,
      );
    });

    it('should have a wrapper with the correct width', () => {
      const { container } = component;
      const wrapper = container.querySelector('div');

      expect(wrapper).toHaveStyle(`
        border-radius: 50%;
        display: inline-block;
        overflow: hidden;
        width: 100px;
      `);
    });

    it('should have an image with the correct width', async () => {
      const { findByAltText } = component;

      await expect(findByAltText('Alt text')).resolves.toHaveStyle(`
        display: block;
        width: 100px;
      `);
    });
  });
});
