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
import Currency from '../../../components/Currency';
import TransactionArrow from '../../../components/TransactionArrow';
import withLayout from '../../../hoc/withLayout';

const data = {
  getAccounts: {
    items: [
      {
        balance: 644.75,
        currency: 'GBP',
        date: '2019-04-18T00:00:00.007Z',
        transactions: [
          {
            amount: 150,
            currency: 'GBP',
            date: '2019-04-18T10:16:10.487Z',
            description: 'Invoice #12',
            id: '48b45431-fecc-459b-948c-414b965289d6',
            name: 'Client 1',
          },
          {
            amount: -5.25,
            currency: 'GBP',
            date: '2019-04-18T12:11:10.487Z',
            description: 'Lunch',
            id: '9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72',
            name: 'KFC',
          },
        ],
      },
      {
        balance: 500,
        currency: 'GBP',
        date: '2019-04-17T00:00:00.007Z',
        transactions: [
          {
            amount: 150,
            currency: 'GBP',
            date: '2019-04-17T10:16:10.487Z',
            description: 'Invoice 33',
            id: '48b45431-fecc-459b-948c-414b965289d6',
            name: 'Client B',
          },
          {
            amount: -5.25,
            currency: 'GBP',
            date: '2019-04-17T12:11:10.487Z',
            description: 'Lunch',
            id: '9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72',
            name: 'Subway',
          },
        ],
      },
    ],
  },
};

interface IAccountsParams {
  companyId: string;
}

const Accounts: FC = () => {
  const { companyId } = useParams<IAccountsParams>();
  const { t } = useTranslation('accounts');
  const action = (amount: number) => {
    if (amount > 0) {
      return 'view-sale';
    }

    return 'view-purchase';
  };

  return (
    <Connected error={undefined} loading={false}>
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
                {data.getAccounts.items.map(item => (
                  <TableBody key={item.date}>
                    <TableRow colour="primary">
                      <TableCell as="th" colSpan={2}>
                        <DateTime value={item.date} format="dddd, DD MMMM" />
                      </TableCell>
                      <TableCell as="th" align="right">
                        <Currency
                          currency={item.currency}
                          value={item.balance}
                        />
                      </TableCell>
                      <TableCell as="th">
                        {t('accounts.transactions.actions')}
                      </TableCell>
                    </TableRow>

                    {item.transactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell align="center">
                          <TransactionArrow value={transaction.amount} />
                        </TableCell>

                        <TableCell>
                          <Typography component="p" variant="h6">
                            {transaction.name}
                          </Typography>

                          <Typography component="p" variant="p" margin="none">
                            {transaction.description}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Currency
                            currency={transaction.currency}
                            value={transaction.amount}
                          />
                        </TableCell>

                        <TableCell>
                          <LinkButton
                            to={`/my-companies/accounts/${companyId}/${action(
                              transaction.amount,
                            )}/${transaction.id}`}
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
                ))}
              </Table>
            </Col>
          </Row>
        </>
      )}
    </Connected>
  );
};

export default withLayout(Accounts);
