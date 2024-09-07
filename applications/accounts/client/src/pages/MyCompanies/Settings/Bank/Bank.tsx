import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  Button,
  Col,
  DataTable,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
  Typography,
} from '@motech-development/breeze-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../../components/Connected';
import ErrorCard from '../../../../components/ErrorCard';
import { gql } from '../../../../graphql';
import { GetBanksQuery } from '../../../../graphql/graphql';
import invariant from '../../../../utils/invariant';

interface IDataRow {
  connect: (bank: string, user?: string) => Promise<void>;
  connectLabel: string;
  data: GetBanksQuery;
  selected: string;
}

interface IDataRowComponent {
  id: string;
  name: string;
}

function row({ connect, connectLabel, data, selected }: IDataRow) {
  function DataRow({ id, name }: IDataRowComponent) {
    return (
      <>
        <TableCell>
          <Typography component="p" variant="h5" margin="none">
            {name}
          </Typography>
        </TableCell>
        <TableCell>
          {data.getBankSettings && (
            <Button
              loading={selected === id}
              disabled={selected !== ''}
              onClick={() => {
                connect(id, data.getBankSettings?.user).catch(() => {});
              }}
              size="sm"
            >
              {connectLabel}
            </Button>
          )}
        </TableCell>
      </>
    );
  }

  return DataRow;
}

export const GET_BANKS = gql(/* GraphQL */ `
  query GetBanks($id: ID!) {
    getBankSettings(id: $id) {
      id
      user
    }
    getBanks {
      items {
        id
        name
      }
    }
  }
`);

export const CREATE_BANK_CONNECTION = gql(/* GraphQL */ `
  mutation CreateBankConnection($input: BankConnectionInput!) {
    createBankConnection(input: $input) {
      status
    }
  }
`);

export const ON_BANK_CALLBACK = gql(/* GraphQL */ `
  subscription OnBackCallback {
    onBankCallback {
      authorisationUrl
    }
  }
`);

// TODO: Get to the bottom of the subscription error
function Bank() {
  const { companyId } = useParams();

  invariant(companyId);

  const { t } = useTranslation('settings');
  const [selected, setSelected] = useState('');
  const { data, error, loading } = useQuery(GET_BANKS, {
    variables: {
      id: companyId,
    },
  });
  const [mutation] = useMutation(CREATE_BANK_CONNECTION);
  const { data: subscription, loading: subscriptionLoading } =
    useSubscription(ON_BANK_CALLBACK);
  const connect = async (bank: string, user?: string) => {
    setSelected(bank);

    await mutation({
      variables: {
        input: {
          bank,
          callback: `${window.location.origin}/my-companies/settings/${companyId}/bank/callback`,
          companyId,
          user,
        },
      },
    });
  };

  useEffect(() => {
    if (subscription && subscription.onBankCallback) {
      const { authorisationUrl } = subscription.onBankCallback;

      window.location.assign(authorisationUrl);
    }
  }, [subscription, subscriptionLoading]);

  return (
    <Connected error={error} loading={loading}>
      {data?.getBanks && (
        <>
          <PageTitle
            title={t('select-bank.title')}
            subTitle={t('select-bank.sub-title')}
          />

          <Row>
            <Col>
              <DataTable
                items={data.getBanks.items}
                header={
                  <TableCell align="left" as="th" colSpan={2}>
                    {t('select-bank.name')}
                  </TableCell>
                }
                row={row({
                  connect,
                  connectLabel: t('select-bank.connect'),
                  data,
                  selected,
                })}
                noResults={
                  <ErrorCard
                    backTo={`/my-companies/settings/${companyId}`}
                    title={t('select-bank.errors.no-banks.title')}
                    description={t('select-bank.errors.no-banks.description')}
                  />
                }
              />
            </Col>

            {data.getBanks.items.length > 0 && (
              <Col>
                <Row>
                  <Col xs={12} md={3} mdOffset={10}>
                    <LinkButton
                      block
                      to={`/my-companies/settings/${companyId}`}
                      colour="secondary"
                      size="lg"
                    >
                      {t('select-bank.cancel')}
                    </LinkButton>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </>
      )}
    </Connected>
  );
}

export default Bank;
