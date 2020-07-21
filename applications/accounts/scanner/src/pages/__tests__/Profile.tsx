import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import TestProvider, { logout } from '../../utils/TestProvider';
import Profile from '../Profile';

describe('Profile', () => {
  let component: RenderResult;

  describe('when user is not loaded', () => {
    beforeEach(() => {
      component = render(
        <TestProvider user={null}>
          <Profile />
        </TestProvider>,
      );
    });

    it('should show loading spinner', async () => {
      const { findByTestId } = component;

      await expect(
        findByTestId('profile-loading'),
      ).resolves.toBeInTheDocument();
    });
  });

  describe('when user is loaded with a picture', () => {
    beforeEach(() => {
      component = render(
        <TestProvider
          user={{
            name: 'Mo Gusbi',
            picture: 'https://user.com/picture.gif',
          }}
        >
          <Profile />
        </TestProvider>,
      );
    });

    it('should display user name', async () => {
      const { findByText } = component;

      await expect(findByText('Mo Gusbi')).resolves.toBeInTheDocument();
    });

    it('should display user photo', async () => {
      const { findByRole } = component;

      await expect(findByRole('img')).resolves.toBeInTheDocument();
    });

    it('should log user out', async () => {
      const { findByText } = component;
      const button = await findByText('log-out');

      fireEvent.click(button);

      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      });
    });
  });

  describe('when user is loaded without a picture', () => {
    beforeEach(() => {
      component = render(
        <TestProvider>
          <Profile />
        </TestProvider>,
      );
    });

    it('should display user name', async () => {
      const { findByText } = component;

      await expect(findByText('Mo Gusbi')).resolves.toBeInTheDocument();
    });

    it('should not display user photo', () => {
      const { queryByRole } = component;

      expect(queryByRole('img')).not.toBeInTheDocument();
    });

    it('should log user out', async () => {
      const { findByText } = component;
      const button = await findByText('log-out');

      fireEvent.click(button);

      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      });
    });
  });
});
