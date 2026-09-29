import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { FormSection, type FormSectionProps } from './FormSection';

expectTypeOf<FormSectionProps>().not.toHaveProperty('className');
expectTypeOf<FormSectionProps>().not.toHaveProperty('style');
expectTypeOf<FormSectionProps>().not.toHaveProperty('loading');

describe('FormSection', () => {
  it('groups fields under an accessible title and description', () => {
    render(
      <BreezeProvider locale="en-GB">
        <FormSection
          description="Used for account correspondence."
          title="Contact details"
        >
          <input aria-label="Email" type="email" />
        </FormSection>
      </BreezeProvider>,
    );

    const section = screen.getByRole('group', { name: 'Contact details' });
    const description = screen.getByText('Used for account correspondence.');

    expect(section).toContainElement(
      screen.getByRole('textbox', { name: 'Email' }),
    );
    expect(section).toHaveAccessibleDescription(
      'Used for account correspondence.',
    );
    expect(description.id).not.toBe('');
  });

  it('renders without a description', () => {
    render(
      <BreezeProvider locale="en-GB">
        <FormSection title="Preferences">
          <input aria-label="Newsletter" type="checkbox" />
        </FormSection>
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('group', { name: 'Preferences' }),
    ).not.toHaveAttribute('aria-describedby');
  });

  it('uses unique description relationships for multiple sections', () => {
    render(
      <BreezeProvider locale="en-GB">
        <>
          <FormSection description="Primary contact." title="Contact">
            <input aria-label="Contact email" type="email" />
          </FormSection>
          <FormSection description="Billing contact." title="Billing">
            <input aria-label="Billing email" type="email" />
          </FormSection>
        </>
      </BreezeProvider>,
    );

    const descriptions = screen
      .getAllByRole('group')
      .map((section) => section.getAttribute('aria-describedby'));

    expect(new Set(descriptions).size).toBe(2);
    expect(
      descriptions.every(
        (descriptionId) =>
          descriptionId !== null && document.getElementById(descriptionId),
      ),
    ).toBe(true);
  });

  it('requires the Breeze provider even when empty', () => {
    expect(() =>
      render(<FormSection title="Contact details">{null}</FormSection>),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
