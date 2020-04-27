import { useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Col,
  DateTime,
  LinkButton,
  PageTitle,
  Row,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import Currency, { formatCurrency } from '../../../components/Currency';
import TransactionArrow from '../../../components/TransactionArrow';
import GET_BALANCE, {
  IGetBalanceInput,
  IGetBalanceOutput,
} from '../../../graphql/balance/GET_BALANCE';
import withLayout from '../../../hoc/withLayout';

interface IAccountsParams {
  companyId: string;
}

const Accounts: FC = () => {
  const { companyId } = useParams<IAccountsParams>();
  const { data, error, loading } = useQuery<
    IGetBalanceOutput,
    IGetBalanceInput
  >(GET_BALANCE, {
    variables: {
      id: companyId,
    },
  });
  const { t } = useTranslation('accounts');
  const action = (amount: number) => {
    if (amount > 0) {
      return 'view-sale';
    }

    return 'view-purchase';
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
                            <Button colour="danger" size="sm">
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
    </Connected>
  );
};

export default withLayout(Accounts);
