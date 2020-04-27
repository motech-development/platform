import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Col,
  DateTime,
  LinkButton,
  Modal,
  PageTitle,
  Row,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ConfirmDelete from '../../../components/ConfirmDelete';
import Connected from '../../../components/Connected';
import Currency, { formatCurrency } from '../../../components/Currency';
import TransactionArrow from '../../../components/TransactionArrow';
import GET_BALANCE, {
  IGetBalanceInput,
  IGetBalanceOutput,
} from '../../../graphql/balance/GET_BALANCE';
import withLayout from '../../../hoc/withLayout';

interface IDeleteTransactionInput {
  id: string;
}

interface IDeleteTransactionOutput {
  deleteTransaction: {
    id: string;
  };
}

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

interface IAccountsParams {
  companyId: string;
}

const Accounts: FC = () => {
  const [selected, setSelected] = useState({
    id: '',
    name: '',
  });
  const [modal, setModal] = useState(false);
  const { add } = useToast();
  const { companyId } = useParams<IAccountsParams>();
  const { data, error, loading } = useQuery<
    IGetBalanceOutput,
    IGetBalanceInput
  >(GET_BALANCE, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('accounts.delete-transaction.success'),
      });

      onDismiss();
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('accounts.delete-transaction.error'),
      });

      onDismiss();
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
  const { t } = useTranslation('accounts');
  const action = (amount: number) => {
    if (amount > 0) {
      return 'view-sale';
    }

    return 'view-purchase';
  };
  const confirmDelete = (id: string, name: string) => {
    setSelected({
      id,
      name,
    });
  };
  const onDelete = () => {
    (async () => {
      const { id } = selected;

      await mutation({
        variables: {
          id,
        },
      });
    })();
  };
  const onDismiss = () => {
    setSelected({
      id: '',
      name: '',
    });
  };

  useEffect(() => {
    setModal(!!selected.id);
  }, [selected]);

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
                  {t('accounts.sales.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('accounts.sales.lead')}
                </Typography>
              </Card>
              <LinkButton
                block
                to={`/my-companies/accounts/${companyId}/add-sale`}
                size="lg"
              >
                {t('accounts.sales.button')}
              </LinkButton>
            </Col>

            <Col xs={12} md={3}>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('accounts.purchases.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('accounts.purchases.lead')}
                </Typography>
              </Card>
              <LinkButton
                block
                to={`/my-companies/accounts/${companyId}/add-purchase`}
                size="lg"
              >
                {t('accounts.purchases.button')}
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
              <Table>
                {data.getBalance.transactions.map(
                  ({ balance, currency, date, items }) => (
                    <TableBody key={date}>
                      <TableRow colour="primary">
                        <TableCell as="th" colSpan={2}>
                          <DateTime value={date} format="dddd, DD MMMM" />
                        </TableCell>
                        <TableCell as="th" align="right">
                          <Currency
                            currency={data.getBalance.currency}
                            value={balance}
                          />
                        </TableCell>
                        <TableCell as="th">
                          {t('accounts.transactions.actions')}
                        </TableCell>
                      </TableRow>

                      {items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell align="center">
                            <TransactionArrow value={item.amount} />
                          </TableCell>

                          <TableCell>
                            <Typography component="p" variant="h6">
                              {item.name}
                            </Typography>

                            <Typography component="p" variant="p" margin="none">
                              {item.description}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <Currency currency={currency} value={item.amount} />
                          </TableCell>

                          <TableCell>
                            <LinkButton
                              to={`/my-companies/accounts/${companyId}/${action(
                                item.amount,
                              )}/${item.id}`}
                              size="sm"
                            >
                              {t('accounts.transactions.view')}
                            </LinkButton>{' '}
                            <Button
                              colour="danger"
                              size="sm"
                              onClick={() => confirmDelete(item.id, item.name)}
                            >
                              {t('accounts.transactions.delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ),
                )}
              </Table>
            </Col>
          </Row>
        </>
      )}

      <Modal isOpen={modal} onDismiss={onDismiss}>
        <Typography rule component="h3" variant="h3" margin="lg">
          {t('accounts.delete-transaction.title')}
        </Typography>

        <Typography component="p" variant="p">
          {t('accounts.delete-transaction.warning')}
        </Typography>

        <ConfirmDelete
          loading={deleteLoading}
          name={selected.name}
          onCancel={onDismiss}
          onDelete={onDelete}
        />
      </Modal>
    </Connected>
  );
};

export default withLayout(Accounts);
