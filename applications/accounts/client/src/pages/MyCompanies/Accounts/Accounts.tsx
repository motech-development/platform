import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  Col,
  LinkButton,
  Masonry,
  PageTitle,
  Row,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import { formatCurrency } from '../../../components/Currency';
import TransactionsList from '../../../components/TransactionsList';
import {
  useApplyTransactionState,
  useTransactionItems,
} from '../../../components/TransactionUpdates';
import { gql } from '../../../graphql';
import { TransactionStatus } from '../../../graphql/graphql';
import invariant from '../../../utils/invariant';

export const GET_BALANCE = gql(/* GraphQL */ `
  query GetBalance(
    $count: Int
    $id: ID!
    $status: TransactionStatus!
    $nextToken: String
  ) {
    getBalance(id: $id) {
      balance
      currency
      id
      vat {
        owed
        paid
      }
    }
    getTransactions(
      count: $count
      id: $id
      status: $status
      nextToken: $nextToken
    ) {
      id
      items {
        amount
        attachment
        date
        description
        id
        name
      }
      nextToken
      status
    }
  }
`);

export const DELETE_TRANSACTION = gql(/* GraphQL */ `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      companyId
      id
      status
    }
  }
`);

export const ON_TRANSACTION = gql(/* GraphQL */ `
  subscription OnTransaction($id: ID!, $owner: String!) {
    onTransaction(id: $id, owner: $owner) {
      balance
      vat {
        owed
        paid
      }
    }
  }
`);

function Accounts() {
  const { companyId } = useParams();
  const { user } = useAuth0();

  invariant(user);
  invariant(companyId);

  const renderCheck = process.env.NODE_ENV === 'development' ? 2 : 1;
  const renderCount = useRef(0);
  const { t } = useTranslation('accounts');
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingPage = useRef(false);
  const attemptedRefills = useRef(new Set<string>());
  const [visibleLimit, setVisibleLimit] = useState<number>();
  const { add } = useToast();
  const applyTransactionState = useApplyTransactionState();
  const { client, data, error, loading, networkStatus, subscribeToMore } =
    useQuery(GET_BALANCE, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getTransactions }) => {
        setVisibleLimit(getTransactions.items.length);
      },
      variables: {
        count: 100,
        id: companyId,
        status: TransactionStatus.Confirmed,
      },
    });
  const [deleteMutation, { loading: deleteLoading }] = useMutation(
    DELETE_TRANSACTION,
    {
      onCompleted: ({ deleteTransaction }) => {
        if (deleteTransaction)
          applyTransactionState(deleteTransaction.id, null);
        add({
          colour: 'success',
          message: t('delete-transaction.success'),
        });
      },
      onError: () => {
        add({
          colour: 'danger',
          message: t('delete-transaction.error'),
        });
      },
    },
  );
  const transactions = useTransactionItems(
    data?.getTransactions.items,
    TransactionStatus.Confirmed,
    Boolean(data?.getTransactions.nextToken),
    visibleLimit,
  );
  const onDelete = (id: string) => {
    deleteMutation({
      variables: {
        id,
      },
    }).catch(() => {});
  };
  const onLoadMore = useCallback(
    (nextToken: string, count = 100, expandWindow = true) => {
      if (loadingPage.current) return;
      loadingPage.current = true;
      attemptedRefills.current.add(nextToken);
      setLoadingMore(true);

      const variables = {
        count,
        id: companyId,
        nextToken,
        status: TransactionStatus.Confirmed,
      };
      // Cursor responses append without completing the watched first-page query.
      client
        .query({ fetchPolicy: 'no-cache', query: GET_BALANCE, variables })
        .then(({ data: page }) => {
          client.cache.writeQuery({
            data: page,
            query: GET_BALANCE,
            variables,
          });
          if (expandWindow)
            setVisibleLimit(
              (previous) => (previous ?? 0) + page.getTransactions.items.length,
            );
        })
        .catch(() => {})
        .finally(() => {
          loadingPage.current = false;
          setLoadingMore(false);
        });
    },
    [client, companyId],
  );

  const loadedCount = data?.getTransactions.items.length ?? 0;
  const nextToken = data?.getTransactions.nextToken;
  useEffect(() => {
    if (loading || loadingMore || loadingPage.current) return;
    const missing = (visibleLimit ?? loadedCount) - transactions.length;
    if (missing <= 0 || !nextToken) {
      attemptedRefills.current.clear();
      return;
    }
    if (attemptedRefills.current.has(nextToken)) return;

    // Fill vacated positions without expanding the window or replaying a cursor.
    onLoadMore(nextToken, missing, false);
  }, [
    loadedCount,
    loading,
    loadingMore,
    nextToken,
    onLoadMore,
    transactions.length,
    visibleLimit,
  ]);

  useEffect(() => {
    let unsubscribe: () => void;

    renderCount.current += 1;

    if (renderCount.current >= renderCheck) {
      unsubscribe = subscribeToMore({
        document: ON_TRANSACTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data?.onTransaction || !prev.getBalance) {
            return prev;
          }

          return {
            getBalance: {
              ...prev.getBalance,
              ...subscriptionData.data.onTransaction,
            },
            getTransactions: {
              ...prev.getTransactions,
            },
          };
        },
        variables: {
          id: companyId,
          owner: user.sub as string,
        },
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Connected error={error} loading={networkStatus === NetworkStatus.loading}>
      {data?.getBalance && (
        <>
          <PageTitle
            title={t('accounts.title')}
            subTitle={t('accounts.sub-title')}
          />

          <Masonry xs={1} sm={2} md={3} lg={4}>
            <Card padding="lg">
              <Typography rule component="h3" variant="h3" margin="lg">
                {t('accounts.overview.title')}
              </Typography>

              <Typography component="p" variant="lead">
                {t('accounts.overview.balance', {
                  amount: formatCurrency(
                    data.getBalance.currency,
                    data.getBalance.balance,
                  ),
                })}
              </Typography>

              <Typography component="p" variant="lead">
                {t('accounts.overview.vat-owed', {
                  amount: formatCurrency(
                    data.getBalance.currency,
                    data.getBalance.vat.owed,
                  ),
                })}
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                {t('accounts.overview.vat-paid', {
                  amount: formatCurrency(
                    data.getBalance.currency,
                    data.getBalance.vat.paid,
                  ),
                })}
              </Typography>
            </Card>

            <>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('accounts.record-transaction.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('accounts.record-transaction.lead')}
                </Typography>
              </Card>
              <LinkButton
                block
                to={`/my-companies/accounts/${companyId}/record-transaction`}
                size="lg"
              >
                {t('accounts.record-transaction.button')}
              </LinkButton>
            </>

            <>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('accounts.pending-transactions.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('accounts.pending-transactions.lead')}
                </Typography>
              </Card>
              <LinkButton
                block
                to={`/my-companies/accounts/${companyId}/pending-transactions`}
                size="lg"
              >
                {t('accounts.pending-transactions.button')}
              </LinkButton>
            </>

            <>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('accounts.dashboard.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('accounts.dashboard.lead')}
                </Typography>
              </Card>
              <LinkButton
                block
                to={`/my-companies/dashboard/${companyId}`}
                colour="danger"
                size="lg"
              >
                {t('accounts.dashboard.button')}
              </LinkButton>
            </>
          </Masonry>

          <Row>
            <Col xs={12}>
              <TransactionsList
                companyId={data.getBalance.id}
                currency={data.getBalance.currency}
                loading={deleteLoading}
                onDelete={onDelete}
                transactions={transactions}
              />
            </Col>

            {data.getTransactions.nextToken && (
              <Col xs={12}>
                <Button
                  block
                  loading={loadingMore}
                  onClick={() => {
                    onLoadMore(data.getTransactions.nextToken!);
                  }}
                >
                  {t('accounts.load-more')}
                </Button>
              </Col>
            )}
          </Row>
        </>
      )}
    </Connected>
  );
}

export default Accounts;
