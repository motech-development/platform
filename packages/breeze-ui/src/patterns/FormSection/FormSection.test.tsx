import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { TextField } from '../../primitives/TextField/TextField';
import { FormSection } from './FormSection';

describe('FormSection', () => {
  it('names a section and retains accessible field anatomy', () => {
    renderBreeze(
      <FormSection description="How we contact you." title="Contact details">
        <TextField.Root>
          <TextField.Label>Email address</TextField.Label>
          <TextField.Input type="email" />
        </TextField.Root>
      </FormSection>,
    );

    expect(
      screen.getByRole('region', { name: 'Contact details' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Email address' }),
    ).toBeVisible();
    expect(screen.getByRole('region')).toHaveClass(
      'py-6',
      'md:py-7',
      'gap-4',
      'md:grid-cols-[minmax(12.5rem,15rem)_minmax(0,1fr)]',
      'md:gap-12',
    );
    expect(screen.getByRole('region')).not.toHaveClass('border-t');
  });

  it('supports stacked drawer rhythm, outer dividers, and nested headings', () => {
    renderBreeze(
      <FormSection
        description={null}
        divided
        headingLevel={3}
        layout="stacked"
        title="Contact details"
      >
        <TextField.Root>
          <TextField.Label>Email address</TextField.Label>
          <TextField.Input type="email" />
        </TextField.Root>
      </FormSection>,
    );

    const section = screen.getByRole('region', { name: 'Contact details' });
    const heading = screen.getByRole('heading', {
      level: 3,
      name: 'Contact details',
    });

    expect(section).toHaveClass(
      'border-b',
      'border-[var(--breeze-border)]',
      'pb-6',
    );
    expect(section).not.toHaveClass('border-t');
    expect(heading.parentElement).toHaveClass(
      'gap-1',
      'border-b',
      'border-[var(--breeze-border)]',
      'pb-5',
      'sm:pb-6',
    );
    expect(heading.parentElement?.querySelector('p')).toBeNull();
    expect(heading).toHaveClass('leading-[1.2]');
  });

  it('places a section action after fields on compact layouts and before them on desktop', () => {
    renderBreeze(
      <FormSection
        action={<Button appearance="text">Add category</Button>}
        title="Categories"
      >
        <TextField.Root>
          <TextField.Label>Category</TextField.Label>
          <TextField.Input />
        </TextField.Root>
      </FormSection>,
    );

    const action = screen.getByRole('button', {
      name: 'Add category',
    }).parentElement;
    const fields = screen.getByRole('textbox', { name: 'Category' })
      .parentElement?.parentElement;

    expect(action).toHaveAttribute('data-breeze-form-section-action');
    expect(action?.parentElement).toHaveClass(
      'flex-col-reverse',
      'gap-3',
      'md:flex-col',
      'md:gap-5',
    );
    expect(action).toHaveClass('justify-start', 'md:justify-end');
    expect(fields).toHaveAttribute('data-breeze-form-section-fields');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Categories' })
        .parentElement,
    ).toHaveClass('gap-1');
  });
});
