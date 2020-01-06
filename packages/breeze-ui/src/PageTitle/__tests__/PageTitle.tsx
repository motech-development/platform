import { render } from '@testing-library/react';
import React from 'react';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  it('should display only a title', async () => {
    const { findByText } = render(<PageTitle title="Page title" />);

    await expect(findByText('Page title')).resolves.toBeInTheDocument();
  });

  it('should render title and a sub title', async () => {
    const { findByText } = render(
      <PageTitle title="Page title" subTitle="Sub title" />,
    );

    await expect(findByText('Sub title')).resolves.toBeInTheDocument();
  });
});
