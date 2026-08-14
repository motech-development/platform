import type { Locator, Page, Response } from '@playwright/test';
import { expect } from './test';

export default async function dismissNotifications(
  page: Page,
  notifications: Locator,
): Promise<void> {
  let resolveMarkReadResponse: (response: Response) => void = () => undefined;
  const markReadResponse = new Promise<Response>((resolve) => {
    resolveMarkReadResponse = resolve;
  });
  const captureMarkReadResponse = (response: Response) => {
    const request = response.request();

    if (request.method() !== 'POST') return;

    try {
      const body = request.postDataJSON() as { operationName?: unknown };

      if (body.operationName === 'MarkNotificationsRead') {
        resolveMarkReadResponse(response);
      }
    } catch {
      // Other POST responses do not participate in notification dismissal.
    }
  };

  page.on('response', captureMarkReadResponse);

  try {
    const hasUnreadNotifications = await notifications.evaluate((button) => {
      const hasUnread =
        button.getAttribute('aria-label') !== 'Notifications (0 unread)';

      if (!(button instanceof HTMLElement)) {
        throw new Error('Notifications trigger is not interactive');
      }

      button.click();

      return hasUnread;
    });

    if (hasUnreadNotifications) {
      const response = await markReadResponse;
      const result = (await response.json()) as {
        data?: {
          markAsRead?: {
            items?: Array<{ read?: boolean } | null> | null;
          } | null;
        };
        errors?: unknown;
      };

      expect(response.ok()).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data?.markAsRead?.items?.every((item) => item?.read)).toBe(
        true,
      );
    }
  } finally {
    page.off('response', captureMarkReadResponse);
  }

  await expect(
    page.getByRole('button', { name: 'Notifications (0 unread)' }),
  ).toBeVisible();
}
