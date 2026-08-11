import {
  Button,
  ConfirmationDialog,
  Drawer,
  FormActions,
  StatePanel,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { DashboardPageContent } from './DashboardPageContent';
import { RecordTransactionFormFields } from './RecordTransactionFormFields';
import { TransactionsPageContent } from './TransactionsPageContent';
import {
  type ConfirmedSaleReturnRoute,
  useConfirmedSaleForm,
} from './useConfirmedSaleForm';

type RecordTransactionOrigin = 'dashboard' | 'transactions';

const recordTransactionOrigins = {
  dashboard: {
    Background: DashboardPageContent,
    returnTo: '/my-companies/dashboard/$companyId',
  },
  transactions: {
    Background: TransactionsPageContent,
    returnTo: '/my-companies/accounts/$companyId',
  },
} as const satisfies Record<
  RecordTransactionOrigin,
  {
    Background: typeof DashboardPageContent | typeof TransactionsPageContent;
    returnTo: ConfirmedSaleReturnRoute;
  }
>;

export function RecordTransactionPage({
  companyId,
  origin,
}: Readonly<{
  companyId: string;
  origin: RecordTransactionOrigin;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);
  const { Background, returnTo } = recordTransactionOrigins[origin];
  const {
    clients,
    data,
    dirty,
    discardOpen,
    error,
    form,
    leaveForm,
    loading,
    markDirty,
    online,
    refetch,
    requestClose,
    resetBlockedNavigation,
    setDiscardOpen,
    submissionPending,
    trackAttachmentTransfer,
    vatRate,
  } = useConfirmedSaleForm(companyId, returnTo);

  return (
    <>
      <Background companyId={companyId} />
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) {
            requestClose();
          }
        }}
        open
        triggerless
      >
        <Drawer.Content
          dismissible={!submissionPending}
          keyboardDismissDisabled={submissionPending}
          placement={{ base: 'bottom', md: 'end' }}
          size="wide"
        >
          <Drawer.Description>
            {t('Record a confirmed sale.')}
          </Drawer.Description>
          <Drawer.Title>{t('Record transaction')}</Drawer.Title>
          {error ? (
            <StatePanel
              action={
                <Button
                  disabled={loading}
                  onAction={() => {
                    refetch().catch(() => undefined);
                  }}
                >
                  {t('Try again', { ns: 'routing' })}
                </Button>
              }
              description={t('Clients and VAT settings could not be loaded.')}
              icon={<span aria-hidden="true">!</span>}
              title={t('Sale form unavailable')}
              variant="danger"
            />
          ) : null}
          {loading ? (
            <p aria-live="polite">{t('Preparing sale form…')}</p>
          ) : null}
          {data && clients.length === 0 ? (
            <StatePanel
              description={t('Add a client before recording a confirmed sale.')}
              icon={<span aria-hidden="true">!</span>}
              title={t('No clients available')}
            />
          ) : null}
          {data && clients.length > 0 ? (
            <form
              className="grid min-h-full gap-6"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit().catch(() => undefined);
              }}
            >
              <RecordTransactionFormFields
                clients={clients}
                companyId={companyId}
                form={form}
                markDirty={markDirty}
                online={online}
                trackAttachmentTransfer={trackAttachmentTransfer}
                vatRate={vatRate}
              />
              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting] as const
                }
              >
                {([canSubmit, isSubmitting]) => (
                  <FormActions
                    cancel={
                      dirty ? (
                        <ConfirmationDialog
                          cancelLabel={t('Keep editing')}
                          closeLabel={t('Close discard confirmation')}
                          confirmLabel={t('Discard changes')}
                          description={t(
                            'The transaction details entered on this page will be lost.',
                          )}
                          disabled={submissionPending}
                          onConfirm={leaveForm}
                          onOpenChange={(open) => {
                            setDiscardOpen(open);
                            if (!open) {
                              resetBlockedNavigation();
                            }
                          }}
                          open={discardOpen}
                          title={t('Discard these transaction changes?')}
                          trigger={t('Cancel')}
                          triggerAppearance="outline"
                          variant="warning"
                        />
                      ) : (
                        <Button appearance="outline" onAction={leaveForm}>
                          {t('Cancel')}
                        </Button>
                      )
                    }
                    primary={
                      <Button
                        disabled={!online || !canSubmit || isSubmitting}
                        loading={isSubmitting}
                        type="submit"
                      >
                        {online ? t('Save') : t('Connection required')}
                      </Button>
                    }
                  />
                )}
              </form.Subscribe>
            </form>
          ) : null}
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
