import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Drawer } from '../../primitives/Drawer/Drawer';
import { AttachmentRow } from '../AttachmentRow/AttachmentRow';
import { DocumentViewer } from './DocumentViewer';

function createPdfDataUrl() {
  const firstPage =
    'BT /F1 22 Tf 72 700 Td (PDF.js worker rendered page one) Tj ET';
  const secondPage =
    'BT /F1 22 Tf 72 700 Td (PDF.js worker rendered page two) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${firstPage.length} >>\nstream\n${firstPage}\nendstream`,
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>',
    `<< /Length ${secondPage.length} >>\nstream\n${secondPage}\nendstream`,
  ];
  let document = '%PDF-1.7\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const crossReferenceOffset = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    document += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF`;

  return `data:application/pdf;base64,${btoa(document)}`;
}

const pdfDataUrl = createPdfDataUrl();

const meta = {
  component: DocumentViewer,
  title: 'Files/DocumentViewer',
} satisfies Meta<typeof DocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectPaintedPdfPage(dialog: HTMLElement, pageText: string) {
  await waitFor(async () => {
    const stage = within(dialog).getByRole('region', {
      name: 'Workshop invoice',
    });
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(
      stage.querySelector('.breeze-pdf-text-layer')?.textContent,
    ).toContain(pageText);
    const page = stage.querySelector('.breeze-pdf-page');
    const canvas = stage.querySelector('canvas');
    await expect(page?.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(page?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(canvas?.width).toBeGreaterThan(0);
    await expect(canvas?.height).toBeGreaterThan(0);
    if (!canvas) throw new Error('The rendered PDF canvas was not found.');
    const pixels = canvas
      .getContext('2d')
      ?.getImageData(0, 0, canvas.width, canvas.height).data;
    await expect(pixels).toBeDefined();
    const hasInk = Array.from(pixels ?? []).some(
      (value, index, allPixels) =>
        index % 4 === 0 && value < 96 && (allPixels[index + 3] ?? 0) > 0,
    );
    await expect(hasInk).toBe(true);
  });
}

/** A two-page PDF rendered by the optional, lazy PDF.js engine and worker. */
export const PdfWorker: Story = {
  args: {
    defaultOpen: true,
    mediaType: 'pdf',
    src: pdfDataUrl,
    title: 'Workshop invoice',
  },
  play: async () => {
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Workshop invoice',
    });
    await waitFor(async () =>
      expect(within(dialog).getByText('Page 1 of 2')).toBeVisible(),
    );
    await expectPaintedPdfPage(dialog, 'page one');

    const stage = within(dialog).getByRole('region', {
      name: 'Workshop invoice',
    });
    const initialPage = stage.querySelector('.breeze-pdf-page');
    if (!initialPage) throw new Error('The rendered PDF page was not found.');
    const initialPageBounds = initialPage.getBoundingClientRect();
    const initialStageBounds = stage.getBoundingClientRect();
    await expect(initialPageBounds.width).toBeLessThan(
      initialStageBounds.width,
    );
    await expect(
      initialPageBounds.left + initialPageBounds.width / 2,
    ).toBeCloseTo(initialStageBounds.left + initialStageBounds.width / 2, 0);

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Next page' }),
    );
    await waitFor(async () =>
      expect(within(dialog).getByText('Page 2 of 2')).toBeVisible(),
    );
    await expectPaintedPdfPage(dialog, 'page two');

    const text = stage.querySelector('.breeze-pdf-text-layer span');
    await expect(text).not.toBeNull();
    if (!text) throw new Error('The PDF text layer did not create a span.');
    await expect(getComputedStyle(text).position).toBe('absolute');
    await expect(getComputedStyle(text).fontSize).not.toBe('0px');

    const zoomIn = within(dialog).getByRole('button', { name: 'Zoom in' });
    await Array.from({ length: 8 }).reduce<Promise<void>>(
      (clicks) => clicks.then(() => userEvent.click(zoomIn)),
      Promise.resolve(),
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Rotate clockwise' }),
    );

    const page = stage.querySelector('.breeze-pdf-page');
    if (!page) throw new Error('The rendered PDF page was not found.');
    const stageBounds = stage.getBoundingClientRect();
    await waitFor(async () => {
      await expect(stage.scrollWidth).toBeGreaterThan(stage.clientWidth);
      await expect(stage.scrollHeight).toBeGreaterThan(stage.clientHeight);
    });
    stage.scrollTo({ left: 0, top: 0 });
    await waitFor(async () => {
      const bounds = page.getBoundingClientRect();
      await expect(bounds.left).toBeGreaterThanOrEqual(stageBounds.left - 1);
      await expect(bounds.top).toBeGreaterThanOrEqual(stageBounds.top - 1);
    });
    stage.scrollTo({ left: stage.scrollWidth, top: stage.scrollHeight });
    await waitFor(async () => {
      const bounds = page.getBoundingClientRect();
      await expect(bounds.right).toBeLessThanOrEqual(stageBounds.right + 1);
      await expect(bounds.bottom).toBeLessThanOrEqual(stageBounds.bottom + 1);
    });
  },
};

function AttachmentMorphExample() {
  const [actionStatus, setActionStatus] = useState('');
  const [open, setOpen] = useState(false);
  const transitionName = 'workshop-invoice-preview';
  const recordAction = (action: string) => {
    setActionStatus((current) => (current ? `${current}, ${action}` : action));
  };

  return (
    <Drawer defaultOpen title="Account record" trigger="Open account record">
      <AttachmentRow
        fileType="document"
        filename="workshop-invoice.pdf"
        onOpen={() => setOpen(true)}
        sizeBytes={91_000}
        status="Uploaded"
        transitionName={transitionName}
      />
      {actionStatus ? <p role="status">{actionStatus}</p> : null}
      <DocumentViewer
        downloadName="workshop-invoice.pdf"
        mediaType="pdf"
        onRemove={() => recordAction('Remove selected')}
        onOpenChange={setOpen}
        onReplace={() => recordAction('Replace selected')}
        open={open}
        src={pdfDataUrl}
        title="Workshop invoice"
        transitionName={transitionName}
      />
    </Drawer>
  );
}

/** Opens from its matching attachment row and morphs into the reader. */
export const FromAttachmentRow: Story = {
  args: {
    defaultOpen: false,
    mediaType: 'pdf',
    src: pdfDataUrl,
    title: 'Workshop invoice',
  },
  play: async () => {
    const { page } = await import('vitest/browser');
    await page.viewport(1280, 800);

    const transitionName = 'workshop-invoice-preview';
    const startViewTransitionDescriptor = Object.getOwnPropertyDescriptor(
      document,
      'startViewTransition',
    );
    const records: {
      next: { name: string; viewer: boolean }[];
      old: { name: string; viewer: boolean }[];
      rootAnimations?: string[];
      transition: ViewTransition;
      types: string[];
    }[] = [];
    const nativeStartViewTransition =
      document.startViewTransition.bind(document);
    const collectParticipants = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-breeze-transition-name]'),
      )
        .map((element) => ({
          name: getComputedStyle(element).viewTransitionName,
          viewer: element.querySelector('[aria-label="Zoom in"]') !== null,
        }))
        .filter(({ name }) => name !== 'none' && name !== '');

    try {
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: (options: StartViewTransitionOptions) => {
          const update = options.update as
            | (() => void | Promise<void>)
            | undefined;
          const record: (typeof records)[number] = {
            next: [] as { name: string; viewer: boolean }[],
            old: [] as { name: string; viewer: boolean }[],
            transition: null as unknown as ViewTransition,
            types: Array.from(options.types ?? []),
          };
          record.transition = nativeStartViewTransition({
            ...options,
            update: async () => {
              record.old = collectParticipants();
              await update?.();
              record.next = collectParticipants();
            },
          });
          record.transition.ready.then(
            () => {
              record.rootAnimations = [
                getComputedStyle(
                  document.documentElement,
                  '::view-transition-old(root)',
                ).animationName,
                getComputedStyle(
                  document.documentElement,
                  '::view-transition-new(root)',
                ).animationName,
              ];
            },
            () => undefined,
          );
          records.push(record);
          return record.transition;
        },
      });

      await userEvent.click(
        within(document.body).getByRole('button', {
          name: 'Open: workshop-invoice.pdf',
        }),
      );
      const dialog = await within(document.body).findByRole('dialog', {
        name: 'Workshop invoice',
      });
      await waitFor(async () =>
        expect(within(dialog).getByText('Page 1 of 2')).toBeVisible(),
      );
      await expectPaintedPdfPage(dialog, 'page one');

      const openTransition = records.find(({ types }) =>
        types.includes('expand'),
      );
      if (!openTransition)
        throw new Error('The row-to-viewer transition did not start.');
      await openTransition.transition.ready;
      await openTransition.transition.updateCallbackDone;
      await expect(openTransition.old).toEqual([
        { name: transitionName, viewer: false },
      ]);
      await expect(openTransition.next).toEqual([
        { name: transitionName, viewer: true },
      ]);
      await openTransition.transition.finished;
      const modeTransition = records.find(({ types }) =>
        types.includes('mode'),
      );
      if (!modeTransition)
        throw new Error('The viewer mode transition did not start.');
      await modeTransition.transition.ready;
      await expect(modeTransition.rootAnimations).toEqual(['none', 'none']);
      await modeTransition.transition.finished;

      const panel = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-breeze-transition-name="${transitionName}"]`,
        ),
      ).find((element) => element.querySelector('[aria-label="Zoom in"]'));
      const toolbar = panel?.firstElementChild as HTMLElement | null;
      if (!panel || !toolbar)
        throw new Error('The document toolbar is missing.');
      const panelBounds = panel.getBoundingClientRect();
      await expect(panelBounds.left).toBe(0);
      await expect(panelBounds.top).toBe(0);
      await expect(panelBounds.width).toBe(window.innerWidth);
      await expect(panelBounds.height).toBe(window.innerHeight);
      await expect(toolbar.getBoundingClientRect().width).toBeGreaterThan(0);
      await expect(dialog.querySelector('.breeze-overlay-header')).toBeNull();
      await expect(
        within(dialog).getByRole('button', { name: 'Rotate clockwise' }),
      ).toHaveTextContent('Rotate');
      await expect(
        within(dialog).getByRole('button', { name: 'Replace' }),
      ).toBeVisible();
      await expect(
        within(dialog).getByRole('button', { name: 'Remove' }),
      ).toBeVisible();

      const desktopShot = await page.screenshot({
        path: '/tmp/document-viewer-desktop.png',
      });
      await expect(desktopShot.length).toBeGreaterThan(0);

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Replace' }),
      );
      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Remove' }),
      );

      await page.viewport(390, 844);
      const filename = toolbar.querySelector<HTMLElement>(
        '[title="workshop-invoice.pdf"]',
      );
      const zoomOut = toolbar.querySelector<HTMLButtonElement>(
        '[aria-label="Zoom out"]',
      );
      if (!filename || !zoomOut) {
        throw new Error(
          'The compact toolbar is missing its filename or controls.',
        );
      }
      await waitFor(async () => {
        await expect(getComputedStyle(filename).flexBasis).toBe('100%');
        await expect(filename.getBoundingClientRect().width).toBeGreaterThan(0);
        await expect(zoomOut.getBoundingClientRect().top).toBeGreaterThan(
          filename.getBoundingClientRect().top,
        );
        await expect(
          zoomOut.getBoundingClientRect().height,
        ).toBeGreaterThanOrEqual(34);
      });
      const phoneShot = await page.screenshot({
        path: '/tmp/document-viewer-phone.png',
      });
      await expect(phoneShot.length).toBeGreaterThan(0);

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Close' }),
      );
      const closeTransition = records.filter(({ types }) =>
        types.includes('expand'),
      )[1];
      if (!closeTransition)
        throw new Error('The viewer-to-row transition did not start.');
      await closeTransition.transition.ready;
      await closeTransition.transition.updateCallbackDone;
      await expect(closeTransition.old).toEqual([
        { name: transitionName, viewer: true },
      ]);
      await expect(closeTransition.next).toEqual([
        { name: transitionName, viewer: false },
      ]);
      await waitFor(async () =>
        expect(
          within(document.body).getByRole('button', {
            name: 'Open: workshop-invoice.pdf',
          }),
        ).toHaveFocus(),
      );
      await closeTransition.transition.finished;
      await expect(
        within(document.body).getByText('Replace selected, Remove selected'),
      ).toBeVisible();
    } finally {
      if (startViewTransitionDescriptor) {
        Object.defineProperty(
          document,
          'startViewTransition',
          startViewTransitionDescriptor,
        );
      } else {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
      await page.viewport(1280, 800);
    }
  },
  render: () => <AttachmentMorphExample />,
};

/** A photograph uses the same toolbar without loading the PDF engine. */
export const Image: Story = {
  args: {
    defaultOpen: true,
    mediaType: 'image',
    src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22320%22 viewBox=%220 0 480 320%22%3E%3Crect width=%22480%22 height=%22320%22 fill=%22%23dcebe6%22/%3E%3Cpath d=%22M0 260 145 110l115 120 75-90 145 150v30H0z%22 fill=%22%23699586%22/%3E%3C/svg%3E',
    title: 'Workshop entrance',
  },
};
