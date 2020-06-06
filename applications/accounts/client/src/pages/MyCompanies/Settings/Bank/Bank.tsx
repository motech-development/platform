import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
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
import React, { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../../components/Connected';
import ErrorCard from '../../../../components/ErrorCard';
import CREATE_BANK_CONNECTION, {
  ICreateBankConnectionInput,
  ICreateBankConnectionOutput,
} from '../../../../graphql/bank/CREATE_BANK_CONNECTION';
import GET_BANKS, {
  IGetBanksInput,
  IGetBanksOutput,
} from '../../../../graphql/bank/GET_BANKS';
import ON_BANK_CALLBACK, {
  IOnBankCallbackOutput,
} from '../../../../graphql/bank/ON_BANK_CALLBACK';

interface ISelectBankParams {
  companyId: string;
}

// TODO: Get to the bottom of the subscription error
const Bank: FC = () => {
  const { companyId } = useParams<ISelectBankParams>();
  const { t } = useTranslation('settings');
  const [selected, setSelected] = useState('');
  const { data, error, loading } = useQuery<IGetBanksOutput, IGetBanksInput>(
    GET_BANKS,
    {
      variables: {
        id: companyId,
      },
    },
  );
  const [mutation] = useMutation<
    ICreateBankConnectionOutput,
    ICreateBankConnectionInput
  >(CREATE_BANK_CONNECTION);
  const { data: subscription, loading: subscriptionLoading } = useSubscription<
    IOnBankCallbackOutput
  >(ON_BANK_CALLBACK);
  const connect = (bank: string, user: string) => {
    (async () => {
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
    })();
  };

  useEffect(() => {
    if (subscription && subscription.onBankCallback) {
      const { authorisationUrl } = subscription.onBankCallback;

      window.location.assign(authorisationUrl);
    }
  }, [subscription, subscriptionLoading]);

  return (
    <Connected error={error} loading={loading}>
      {data && (
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
                row={({ id, name }) => (
                  <>
                    <TableCell>
                      <Typography component="p" variant="h5" margin="none">
                        {name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        loading={selected === id}
                        disabled={selected !== ''}
                        onClick={() => connect(id, data.getBankSettings.user)}
                        size="sm"
                      >
                        {t('select-bank.connect')}
                      </Button>
                    </TableCell>
                  </>
                )}
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
};

export default memo(Bank);
