import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Slider } from './Slider';

describe('Slider', () => {
  it('reports semantic values through keyboard range interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Slider.Root
        defaultValue={20}
        max={100}
        min={0}
        onChange={onChange}
        step={5}
      >
        <Slider.Label>Volume</Slider.Label>
        <Slider.Output />
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb name="volume" />
        </Slider.Track>
      </Slider.Root>,
    );

    const slider = screen.getByRole('slider', { name: 'Volume' });

    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenLastCalledWith(25);
    expect(slider).toHaveValue('25');
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(slider).toHaveAttribute('name', 'volume');
  });

  it('uses vertical keyboard direction and clamps to constraints', async () => {
    const user = userEvent.setup();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const errorRef = createRef<HTMLParagraphElement>();
    const labelRef = createRef<HTMLLabelElement>();
    const outputRef = createRef<HTMLOutputElement>();
    const trackRef = createRef<HTMLDivElement>();

    renderBreeze(
      <Slider.Root
        defaultValue={5}
        invalid
        max={10}
        min={0}
        orientation="vertical"
        step={5}
      >
        <Slider.Label className="max-w-xl" ref={labelRef}>
          Level
        </Slider.Label>
        <Slider.Output className="text-base" ref={outputRef} />
        <Slider.Track className="h-48" ref={trackRef}>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
        <Slider.Description className="text-base" ref={descriptionRef}>
          Choose a level.
        </Slider.Description>
        <Slider.Error className="font-bold" ref={errorRef}>
          Level is unavailable.
        </Slider.Error>
      </Slider.Root>,
    );

    const slider = screen.getByRole('slider', { name: 'Level' });
    const root = labelRef.current?.parentElement;
    const thumb = slider.parentElement?.parentElement;

    expect(root).toHaveClass(
      'grid',
      '[&>[data-breeze-slider-description]]:col-span-2',
      '[&>[data-breeze-slider-error]]:col-span-2',
      '[&>[data-breeze-slider-label]]:col-start-1',
      '[&>[data-breeze-slider-output]]:col-start-2',
      '[&>[data-breeze-slider-track]]:col-span-2',
    );
    expect(labelRef.current).toHaveAttribute('data-breeze-slider-label');
    expect(labelRef.current).toHaveClass('max-w-xl');
    expect(outputRef.current).toHaveAttribute('data-breeze-slider-output');
    expect(outputRef.current).toHaveClass('text-base');
    expect(trackRef.current).toHaveAttribute('data-breeze-slider-track');
    expect(trackRef.current).toHaveClass('h-48');
    expect(thumb).toHaveClass('left-1/2');
    expect(thumb).not.toHaveClass('data-[orientation=vertical]:left-1/2');
    expect(descriptionRef.current).toHaveAttribute(
      'data-breeze-slider-description',
    );
    expect(descriptionRef.current).toHaveClass('text-base');
    expect(errorRef.current).toHaveAttribute('data-breeze-slider-error');
    expect(errorRef.current).toHaveClass('font-bold');
    expect(slider).toHaveAccessibleDescription(
      'Choose a level. Level is unavailable.',
    );

    slider.focus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(slider).toHaveValue('10');
    await user.keyboard('{Home}');
    expect(slider).toHaveValue('0');
  });

  it('preserves controlled and read-only values while disabled prevents focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <div>
        <Slider.Root onChange={onChange} value={30}>
          <Slider.Label>Controlled</Slider.Label>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Root>
        <Slider.Root readOnly value={40}>
          <Slider.Label>Read only</Slider.Label>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Root>
        <Slider.Root disabled defaultValue={50}>
          <Slider.Label>Disabled</Slider.Label>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Root>
      </div>,
    );

    const controlled = screen.getByRole('slider', { name: 'Controlled' });

    controlled.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(31);
    expect(controlled).toHaveValue('30');
    expect(screen.getByRole('slider', { name: 'Read only' })).toBeDisabled();
    expect(screen.getByRole('slider', { name: 'Disabled' })).toBeDisabled();
  });

  it('associates native range refs, descriptions, errors, and form attributes', () => {
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <Slider.Root defaultValue={10} invalid required>
        <Slider.Label>Progress</Slider.Label>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb form="status" inputRef={inputRef} name="progress" />
        </Slider.Track>
        <Slider.Description>Choose a completion percentage.</Slider.Description>
        <Slider.Error>Progress is outside the allowed range.</Slider.Error>
      </Slider.Root>,
    );

    const slider = screen.getByRole('slider', { name: 'Progress' });

    expect(inputRef.current).toBe(slider);
    expect(slider).toBeInvalid();
    expect(slider).toBeRequired();
    expect(slider).toHaveAttribute('form', 'status');
    expect(slider).toHaveAttribute('name', 'progress');
    expect(slider).toHaveAccessibleDescription(
      'Choose a completion percentage. Progress is outside the allowed range.',
    );
  });
});
