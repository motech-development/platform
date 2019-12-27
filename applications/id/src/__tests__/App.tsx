import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('should show an alert if no redirect uri is set', async () => {
    const { findByRole } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await expect(findByRole('alert')).resolves.toHaveTextContent(
      'Error: No redirect URI set.',
    );
  });

  it('should show the log in form if the redirecr uri is set', async () => {
    const { findByRole } = render(
      <MemoryRouter initialEntries={['?redirect_uri=https://localhost:4000']}>
        <App />
      </MemoryRouter>,
    );

    const form = await waitForElement(() => findByRole('form'));

    expect(form).toBeInTheDocument();
  });
});
