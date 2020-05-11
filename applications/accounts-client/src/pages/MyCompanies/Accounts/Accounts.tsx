import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Card,
  Col,
  LinkButton,
  PageTitle,
  Row,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TransactionsList from '../../../components/TransactionsList';
import Connected from '../../../components/Connected';
import { formatCurrency } from '../../../components/Currency';
import GET_BALANCE, {
  IGetBalanceInput,
  IGetBalanceOutput,
} from '../../../graphql/balance/GET_BALANCE';
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import withLayout from '../../../hoc/withLayout';

interface IAccountsParams {
  companyId: string;
}

const Accounts: FC = () => {
  const { companyId } = useParams<IAccountsParams>();
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const { data, error, loading } = useQuery<
    IGetBalanceOutput,
    IGetBalanceInput
  >(GET_BALANCE, {
    variables: {
      id: companyId,
    },
  });
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    awaitRefetchQueries: true,
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
    refetchQueries: () => [
      {
        query: GET_BALANCE,
        variables: {
          id: companyId,
        },
      },
    ],
  });
  const onDelete = (id: string) => {
    (async () => {
      await deleteMutation({
        update: updateCache,
        variables: {
          id,
        },
      });
    })();
  };

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('accounts.title')}
            subTitle={t('accounts.sub-title')}
          />

          <Row>
            <Col xs={12} md={3}>
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
            </Col>

            <Col xs={12} md={3}>
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
            </Col>

            <Col xs={12} md={3}>
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
            </Col>

            <Col xs={12} md={3}>
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
            </Col>

            <Col>
              <TransactionsList
                companyId={data.getBalance.id}
                loading={deleteLoading}
                onDelete={onDelete}
                transactions={data.getBalance.transactions}
              />
            </Col>
          </Row>
        </>
      )}
    </Connected>
  );
};

export default withLayout(Accounts);
