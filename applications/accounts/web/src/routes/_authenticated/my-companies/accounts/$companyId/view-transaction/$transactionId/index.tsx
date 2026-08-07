import { useApolloClient, useQuery } from '@apollo/client/react';
import {
  Button,
  DescriptionList,
  Drawer,
  FormSection,
  Inline,
  StatePanel,
  Surface,
  useToast,
} from '@motech-development/breeze-ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { saveAs } from 'file-saver';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { primeTransaction } from '../../../../../../../data/loaders';
import {
  GET_TRANSACTION,
  REQUEST_DOWNLOAD,
} from '../../../../../../../data/operations';
import { downloadPresignedFile } from '../../../../../../../data/presigned-transfer';
import { TransactionsPageContent } from '../../../../../../../features/transactions/TransactionsPageContent';
import { useLatestTransfer } from '../../../../../../../features/transactions/useLatestTransfer';
import { formatCurrency } from '../../../../../../../formatting/currency';
import { capturePresignedTransferFailure } from '../../../../../../../observability';
import { useOnlineStatus } from '../../../../../../../pwa/connectivity';
import { AccountsPending } from '../../../../../../-RouteState';

const PdfPreview = lazy(() =>
  import('../../../../../../../features/transactions/PdfPreview').then(
    (module) => ({ default: module.PdfPreview }),
  ),
);

function TransactionPage() {
  const { i18n, t } = useTranslation([
    'attachments',
    'transactions',
    'routing',
  ]);
  const { companyId, transactionId } = Route.useParams();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const toast = useToast();
  const online = useOnlineStatus();
  const [file, setFile] = useState<Blob>();
  const [opening, setOpening] = useState(false);
  const openAttachmentTrigger = useRef<HTMLButtonElement>(null);
  const restoreAttachmentFocus = useRef(false);
  const runLatestTransfer = useLatestTransfer();
  const { data, error, loading, refetch } = useQuery(GET_TRANSACTION, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { transactionId },
  });

  const transaction = data?.getTransaction;
  const attachmentName = transaction?.attachment?.split('/').at(-1);
  let openAttachmentLabel = t('Open PDF');

  if (!online) {
    openAttachmentLabel = t('Connection required', { ns: 'transactions' });
  } else if (file) {
    openAttachmentLabel = t('Reopen PDF');
  }

  const close = () => {
    navigate({
      params: { companyId },
      to: '/my-companies/accounts/$companyId',
    }).catch(() => undefined);
  };
  const openAttachment = async () => {
    const attachment = transaction?.attachment;

    if (!attachment) {
      return;
    }

    setOpening(true);
    let ownsOpeningState = true;

    try {
      const result = await runLatestTransfer(async (signal) => {
        const response = await apolloClient.query({
          fetchPolicy: 'no-cache',
          query: REQUEST_DOWNLOAD,
          variables: {
            id: companyId,
            path: attachment,
          },
        });
        const url = response.data?.requestDownload.url;

        if (!url) {
          const missingDestinationError = new Error(
            t('No download destination was returned'),
          );

          capturePresignedTransferFailure(missingDestinationError, 'Download');
          throw missingDestinationError;
        }

        return downloadPresignedFile(url, signal);
      });

      if (result.status === 'cancelled') {
        ownsOpeningState = false;
        return;
      }

      setFile(result.value);
    } catch {
      toast.show({
        description: t('The PDF could not be opened. Try again.'),
        title: t('Attachment unavailable'),
        variant: 'danger',
      });
    } finally {
      if (ownsOpeningState) {
        setOpening(false);
      }
    }
  };

  useEffect(() => {
    if (!file && restoreAttachmentFocus.current) {
      restoreAttachmentFocus.current = false;
      openAttachmentTrigger.current?.focus();
    }
  }, [file]);

  return (
    <>
      <TransactionsPageContent companyId={companyId} />
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) {
            close();
          }
        }}
        open
        triggerless
      >
        <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
          <Drawer.Description>
            {transaction
              ? t('Confirmed on {{date}}', {
                  date: new Intl.DateTimeFormat(i18n.language, {
                    dateStyle: 'long',
                    timeZone: 'UTC',
                  }).format(new Date(transaction.date)),
                })
              : t('Confirmed transaction')}
          </Drawer.Description>
          <Drawer.Title>
            {transaction?.description ||
              t('Transaction', { ns: 'transactions' })}
          </Drawer.Title>
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
              description={t('The confirmed Transaction could not be loaded.')}
              icon={<span aria-hidden="true">!</span>}
              title={t('Transaction unavailable')}
              variant="danger"
            />
          ) : null}
          {loading ? (
            <p aria-live="polite">{t('Loading Transaction…')}</p>
          ) : null}
          {transaction ? (
            <>
              <FormSection
                description={transaction.id}
                divided
                headingLevel={3}
                layout="stacked"
                title={t('Transaction record')}
              >
                <DescriptionList.Root>
                  <DescriptionList.Item>
                    <DescriptionList.Term>
                      {t('Client', { ns: 'transactions' })}
                    </DescriptionList.Term>
                    <DescriptionList.Description>
                      {transaction.name}
                    </DescriptionList.Description>
                  </DescriptionList.Item>
                  <DescriptionList.Item>
                    <DescriptionList.Term>
                      {t('Amount', { ns: 'transactions' })}
                    </DescriptionList.Term>
                    <DescriptionList.Description>
                      {formatCurrency(transaction.amount, 'GBP')}
                    </DescriptionList.Description>
                  </DescriptionList.Item>
                  <DescriptionList.Item>
                    <DescriptionList.Term>
                      {t('VAT', { ns: 'transactions' })}
                    </DescriptionList.Term>
                    <DescriptionList.Description>
                      {formatCurrency(transaction.vat, 'GBP')}
                    </DescriptionList.Description>
                  </DescriptionList.Item>
                  <DescriptionList.Item>
                    <DescriptionList.Term>
                      {t('Category', { ns: 'transactions' })}
                    </DescriptionList.Term>
                    <DescriptionList.Description>
                      {transaction.category}
                    </DescriptionList.Description>
                  </DescriptionList.Item>
                </DescriptionList.Root>
              </FormSection>
              <FormSection
                description={attachmentName || t('No PDF attached')}
                divided
                headingLevel={3}
                layout="stacked"
                title={t('Invoice or receipt')}
              >
                {transaction.attachment ? (
                  <Inline gap="compact">
                    <Button
                      disabled={!online || opening}
                      loading={opening}
                      onAction={() => {
                        openAttachment().catch(() => undefined);
                      }}
                      ref={openAttachmentTrigger}
                    >
                      {openAttachmentLabel}
                    </Button>
                    {file ? (
                      <Button
                        appearance="outline"
                        onAction={() =>
                          saveAs(file, attachmentName || 'sale.pdf')
                        }
                      >
                        {t('Download PDF')}
                      </Button>
                    ) : null}
                  </Inline>
                ) : (
                  <p>{t('This confirmed sale has no source PDF.')}</p>
                )}
              </FormSection>
            </>
          ) : null}
        </Drawer.Content>
      </Drawer.Root>
      {file ? (
        <Drawer.Root
          onOpenChange={(open) => {
            if (!open) {
              restoreAttachmentFocus.current = true;
              setFile(undefined);
            }
          }}
          open
          triggerless
        >
          <Drawer.Content
            adjacent={{ inlineEndOffset: 768 }}
            placement={{ base: 'bottom', md: 'end' }}
          >
            <Drawer.Description>
              {t('Attached to {{description}}', {
                description: transaction?.description,
              })}
            </Drawer.Description>
            <Drawer.Title>
              {attachmentName || t('Invoice or receipt')}
            </Drawer.Title>
            <Surface
              border="none"
              className="-m-6 min-h-full"
              padding="none"
              tone="subtle"
            >
              <Surface className="sticky top-0 z-10" padding="compact">
                <Inline justify="end">
                  <Button
                    appearance="outline"
                    onAction={() => saveAs(file, attachmentName || 'sale.pdf')}
                  >
                    {t('Download PDF')}
                  </Button>
                </Inline>
              </Surface>
              <section aria-label={t('PDF preview')} className="p-6">
                <Suspense fallback={<p>{t('Opening PDF viewer…')}</p>}>
                  <PdfPreview file={file} />
                </Suspense>
              </section>
            </Surface>
          </Drawer.Content>
        </Drawer.Root>
      ) : null}
    </>
  );
}

export const Route = createFileRoute(
  '/_authenticated/my-companies/accounts/$companyId/view-transaction/$transactionId/',
)({
  component: TransactionPage,
  loader: ({ context, params }) =>
    primeTransaction(context, params.companyId, params.transactionId),
  pendingComponent: AccountsPending,
});
