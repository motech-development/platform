import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import * as viewTransitions from '../../motion/view-transitions';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  AttachmentRow,
  type AttachmentRowAction,
  type AttachmentRowProps,
} from './AttachmentRow';

const originalStartViewTransition = Object.getOwnPropertyDescriptor(
  document,
  'startViewTransition',
);
const originalViewTransition = Object.getOwnPropertyDescriptor(
  window,
  'ViewTransition',
);
const originalCss = Object.getOwnPropertyDescriptor(window, 'CSS');
const originalMatchMedia = Object.getOwnPropertyDescriptor(
  window,
  'matchMedia',
);

function restoreDescriptor(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) Object.defineProperty(target, property, descriptor);
  else Reflect.deleteProperty(target, property);
}

function installTypedViewTransitionSupport() {
  class MockViewTransition {}
  Object.defineProperty(MockViewTransition.prototype, 'types', {
    configurable: true,
    value: new Set<string>(),
  });
  Object.defineProperty(window, 'ViewTransition', {
    configurable: true,
    value: MockViewTransition,
  });
  Object.defineProperty(window, 'CSS', {
    configurable: true,
    value: { supports: vi.fn(() => true) },
  });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: false,
      media: query,
      removeEventListener: vi.fn(),
    })),
  });
}

afterEach(() => {
  restoreDescriptor(
    document,
    'startViewTransition',
    originalStartViewTransition,
  );
  restoreDescriptor(window, 'ViewTransition', originalViewTransition);
  restoreDescriptor(window, 'CSS', originalCss);
  restoreDescriptor(window, 'matchMedia', originalMatchMedia);
});

expectTypeOf<AttachmentRowProps>().not.toHaveProperty('children');
expectTypeOf<AttachmentRowProps>().not.toHaveProperty('className');
expectTypeOf<AttachmentRowProps>().not.toHaveProperty('style');
expectTypeOf<{
  actions: AttachmentRowAction[];
  fileType: 'document';
  filename: string;
  sizeBytes: number;
  status: string;
}>().not.toExtend<AttachmentRowProps>();
expectTypeOf<{
  fileType: 'document';
  filename: string;
  sizeBytes: number;
  status: string;
  thumbnailUrl: string;
}>().not.toExtend<AttachmentRowProps>();

describe('AttachmentRow', () => {
  it('shows a document thumbnail, file details, text status, and a direct open action', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="fen-lane-garage-invoice.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
      />,
    );

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('fen-lane-garage-invoice.pdf')).toBeInTheDocument();
    expect(screen.getByText('84 kB')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Open: fen-lane-garage-invoice.pdf' }),
    );

    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('registers only explicitly named rows as expand participants', async () => {
    const user = userEvent.setup();
    let updateCallbackDone = Promise.resolve();
    const startViewTransition = vi.fn((options: StartViewTransitionOptions) => {
      const update = options.update as (() => void | Promise<void>) | undefined;
      updateCallbackDone = Promise.resolve().then(() => update?.());

      return {
        finished: updateCallbackDone,
        ready: Promise.resolve(),
        skipTransition: vi.fn(),
        types: new Set<string>(),
        updateCallbackDone,
      } satisfies ViewTransition;
    });

    installTypedViewTransitionSupport();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    const { container } = renderBreeze(
      <>
        <AttachmentRow
          fileType="document"
          filename="receipt.pdf"
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
          transitionName=" receipt-preview "
        />
        <AttachmentRow
          fileType="document"
          filename="other-receipt.pdf"
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
        />
      </>,
    );
    const participant = container.querySelector<HTMLElement>(
      '[data-breeze-transition-name]',
    );

    expect(participant).toHaveAttribute(
      'data-breeze-transition-name',
      'receipt-preview',
    );
    expect(
      participant?.style.getPropertyValue('--breeze-transition-name'),
    ).toBe('receipt-preview');
    expect(
      container.querySelectorAll('[data-breeze-transition-name]'),
    ).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(
      container.querySelectorAll('[data-breeze-transition-name]'),
    ).toHaveLength(1);
  });

  it('opens an unnamed row directly without registering or starting an expand transition', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const startViewTransition = vi.fn(() => {
      throw new Error('An unnamed row must not start a view transition.');
    });

    installTypedViewTransitionSupport();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    const { container } = renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="receipt.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
      />,
    );

    expect(
      container.querySelector('[data-breeze-transition-name]'),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('opens the attachment when the native view transition API throws synchronously', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const startViewTransition = vi.fn(() => {
      throw new Error('View transitions are unavailable.');
    });

    installTypedViewTransitionSupport();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="receipt.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
        transitionName="receipt-preview"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not retry an open when transition startup throws after its update begins', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const startViewTransition = vi.fn((options: StartViewTransitionOptions) => {
      const update = options.update as (() => void | Promise<void>) | undefined;
      const updateResult = update?.();
      if (updateResult instanceof Promise) {
        updateResult.catch(() => undefined);
      }

      throw new Error('The transition could not finish starting.');
    });

    installTypedViewTransitionSupport();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="receipt.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
        transitionName="receipt-preview"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not retry an open when the transition finishes with an error', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const failure = new Error('The transition animation failed.');
    let transitionFinished: Promise<void> | undefined;
    const startViewTransition = vi.fn((options: StartViewTransitionOptions) => {
      const update = options.update as (() => void | Promise<void>) | undefined;
      const updateCallbackDone = Promise.resolve().then(() => update?.());
      transitionFinished = updateCallbackDone.then(() => {
        throw failure;
      });

      return {
        finished: transitionFinished,
        ready: Promise.resolve(),
        skipTransition: vi.fn(),
        types: new Set<string>(),
        updateCallbackDone,
      } satisfies ViewTransition;
    });

    installTypedViewTransitionSupport();
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="receipt.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
        transitionName="receipt-preview"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));
    await expect(transitionFinished).rejects.toBe(failure);

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('propagates onOpen errors from the transition completion handler', async () => {
    const user = userEvent.setup();
    const callbackError = new Error('The attachment could not be opened.');
    const onOpen = vi.fn(() => {
      throw callbackError;
    });
    let updateError: unknown;
    let transitionErrorHandler:
      | ((reason: unknown) => unknown)
      | null
      | undefined;
    const completion = Promise.resolve();
    const observedCompletion = Object.defineProperty(completion, 'catch', {
      configurable: true,
      value: (
        onRejected: ((reason: unknown) => unknown) | null | undefined,
      ) => {
        transitionErrorHandler = onRejected;
        return Promise.resolve();
      },
    });
    vi.spyOn(viewTransitions, 'startViewTransitionAndWait').mockImplementation(
      (update) => {
        try {
          const updateResult = update();
          if (updateResult instanceof Promise) {
            updateResult.catch(() => undefined);
          }
        } catch (error) {
          updateError = error;
        }

        return observedCompletion;
      },
    );

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="receipt.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
        transitionName="receipt-preview"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));

    expect(updateError).toBe(callbackError);
    expect(transitionErrorHandler).toBeDefined();
    await expect(
      Promise.resolve().then(() => transitionErrorHandler?.(callbackError)),
    ).rejects.toBe(callbackError);
    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('renders a photo thumbnail and exposes menu actions through the callback', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(action: AttachmentRowAction) => void>();
    const downloadAction = {
      icon: 'download',
      id: 'download',
      label: 'Download',
    } satisfies AttachmentRowAction;

    const { container } = renderBreeze(
      <AttachmentRow
        actions={[downloadAction]}
        fileType="photo"
        filename="IMG_4471.jpg"
        onAction={onAction}
        sizeBytes={1_200_000}
        status="Uploaded"
        thumbnailUrl="/attachments/IMG_4471.jpg"
      />,
    );

    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('IMG_4471.jpg')).toBeInTheDocument();
    expect(screen.getByText('1.2 MB')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/attachments/IMG_4471.jpg',
    );

    await user.click(
      screen.getByRole('button', { name: 'More actions: IMG_4471.jpg' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Download' }));

    expect(onAction).toHaveBeenCalledExactlyOnceWith(downloadAction);
  });

  it('replaces unavailable attachment details with a labelled loading progress bar', () => {
    renderBreeze(<AttachmentRow loading />);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getAllByRole('progressbar', { hidden: true })).toHaveLength(
      3,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('announces status updates politely while keeping the status visible', () => {
    const attachment = (status: string) => (
      <BreezeProvider locale="en-GB">
        <AttachmentRow
          fileType="document"
          filename="invoice.pdf"
          sizeBytes={84_000}
          status={status}
        />
      </BreezeProvider>
    );
    const { rerender } = render(attachment('Uploading'));
    const status = screen.getByRole('status');

    expect(status.tagName).toBe('OUTPUT');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Uploading');

    rerender(attachment('Uploaded'));

    expect(status).toHaveTextContent('Uploaded');
    expect(status).toBeVisible();
  });

  it('gives each attachment action button a file-specific accessible name', () => {
    const actions = [{ id: 'download', label: 'Download' }];

    renderBreeze(
      <>
        <AttachmentRow
          actions={actions}
          fileType="document"
          filename="invoice.pdf"
          onAction={() => {}}
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
        />
        <AttachmentRow
          actions={actions}
          fileType="photo"
          filename="receipt.jpg"
          onAction={() => {}}
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
        />
      </>,
    );

    expect(
      screen.getByRole('button', { name: 'Open: invoice.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'More actions: invoice.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open: receipt.jpg' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'More actions: receipt.jpg' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Open')).toHaveLength(2);
    // The overflow trigger is icon-only, as in the prototype.
    expect(screen.queryByText('More actions')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'More actions: invoice.pdf' }),
    ).toHaveTextContent('');
  });

  it('formats the size using the provider locale', () => {
    const { container } = renderBreeze(
      <AttachmentRow
        fileType="photo"
        filename="IMG_4471.jpg"
        sizeBytes={1_200_000}
        status="Uploaded"
      />,
      'de-DE',
    );

    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('1,2 MB')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('rounds a file size into the next unit when needed', () => {
    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="large-report.pdf"
        sizeBytes={999_950}
        status="Uploaded"
      />,
    );

    expect(screen.getByText('1 MB')).toBeInTheDocument();
  });

  it('keeps a fractional byte size in the byte unit', () => {
    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="small-report.pdf"
        sizeBytes={999.5}
        status="Uploaded"
      />,
    );

    expect(screen.getByText('1,000 byte')).toBeInTheDocument();
  });

  it('marks unoverridden labels with their default message language', () => {
    render(
      <BreezeProvider locale="de-DE">
        <AttachmentRow
          actions={[{ id: 'download', label: 'Download' }]}
          fileType="document"
          filename="invoice.pdf"
          onAction={() => {}}
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Document')).toHaveAttribute('lang', 'en-GB');
    expect(
      screen.getByRole('button', { name: 'Open: invoice.pdf' }).parentElement,
    ).toHaveAttribute('lang', 'en-GB');
    expect(
      screen.getByRole('button', { name: 'More actions: invoice.pdf' })
        .parentElement,
    ).toHaveAttribute('lang', 'en-GB');
  });

  it('uses provider overrides and marks them with the provider locale', () => {
    render(
      <BreezeProvider
        locale="de-DE"
        messages={{
          attachmentDocument: 'Dokument',
          attachmentMoreActions: 'Weitere Aktionen',
          attachmentOpen: 'Öffnen',
          attachmentPhoto: 'Foto',
        }}
      >
        <>
          <AttachmentRow
            actions={[{ id: 'download', label: 'Download' }]}
            fileType="document"
            filename="invoice.pdf"
            onAction={() => {}}
            onOpen={() => {}}
            sizeBytes={84_000}
            status="Uploaded"
          />
          <AttachmentRow
            fileType="photo"
            filename="receipt.jpg"
            sizeBytes={84_000}
            status="Uploaded"
          />
        </>
      </BreezeProvider>,
    );

    expect(screen.getByText('Dokument')).toHaveAttribute('lang', 'de-DE');
    expect(screen.getByText('Foto')).toHaveAttribute('lang', 'de-DE');
    expect(
      screen.getByRole('button', { name: 'Öffnen: invoice.pdf' }).parentElement,
    ).toHaveAttribute('lang', 'de-DE');
    expect(
      screen.getByRole('button', { name: 'Weitere Aktionen: invoice.pdf' })
        .parentElement,
    ).toHaveAttribute('lang', 'de-DE');
  });

  it('requires a non-empty visible status', () => {
    expect(() =>
      renderBreeze(
        <AttachmentRow
          fileType="document"
          filename="invoice.pdf"
          sizeBytes={84_000}
          status="  "
        />,
      ),
    ).toThrow('AttachmentRow status must be non-empty.');
  });

  it('requires the Breeze provider', () => {
    expect(() =>
      render(
        <AttachmentRow
          fileType="document"
          filename="invoice.pdf"
          sizeBytes={84_000}
          status="Uploaded"
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
