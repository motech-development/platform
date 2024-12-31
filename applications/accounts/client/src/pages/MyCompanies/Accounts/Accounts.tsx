import { useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  LinkButton,
  Masonry,
  PageTitle,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import { formatCurrency } from '../../../components/Currency';
import TransactionsList from '../../../components/TransactionsList';
import { gql } from '../../../graphql';
import { TransactionStatus } from '../../../graphql/graphql';
import invariant from '../../../utils/invariant';

export const GET_BALANCE = gql(/* GraphQL */ `
  query GetBalance($id: ID!, $status: TransactionStatus!) {
    getBalance(id: $id) {
      balance
      currency
      id
      vat {
        owed
        paid
      }
    }
    getTransactions(id: $id, status: $status) {
      id
      items {
        amount
        attachment
        date
        description
        id
        name
      }
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

  const { add } = useToast();
  const { data, error, loading, subscribeToMore } = useQuery(GET_BALANCE, {
    variables: {
      id: companyId,
      status: TransactionStatus.Confirmed,
    },
  });
  const [deleteMutation, { loading: deleteLoading }] = useMutation(
    DELETE_TRANSACTION,
    {
      onCompleted: () => {
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
  const onDelete = (id: string) => {
    deleteMutation({
      variables: {
        id,
      },
    }).catch(() => {});
  };

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
    <Connected error={error} loading={loading}>
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

          <TransactionsList
            companyId={data.getBalance.id}
            currency={data.getBalance.currency}
            loading={deleteLoading}
            onDelete={onDelete}
            transactions={data.getTransactions.items}
          />
        </>
      )}
    </Connected>
  );
}

export default Accounts;
