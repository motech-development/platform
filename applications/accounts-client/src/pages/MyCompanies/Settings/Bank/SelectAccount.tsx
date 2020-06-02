import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Col,
  PageTitle,
  Row,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../../components/Connected';
import Currency from '../../../../components/Currency';
import DataList from '../../../../components/DataList';
import ErrorCard from '../../../../components/ErrorCard';
import GET_BANK_ACCOUNTS, {
  IGetBankAccountsInput,
  IGetBankAccountsOutput,
} from '../../../../graphql/bank/GET_BANK_ACCOUNTS';
import UPDATE_BANK_SETTINGS, {
  IUpdateBankSettingsInput,
  IUpdateBankSettingsOutput,
} from '../../../../graphql/bank/UPDATE_BANK_SETTINGS';

interface ISelectAccountParams {
  companyId: string;
}

const SelectAccount: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { t } = useTranslation('settings');
  const [selected, setSelected] = useState('');
  const { companyId } = useParams<ISelectAccountParams>();
  const { data, error: bankError, loading } = useQuery<
    IGetBankAccountsOutput,
    IGetBankAccountsInput
  >(GET_BANK_ACCOUNTS, {
    variables: {
      id: companyId,
    },
  });

  const [mutation, { error }] = useMutation<
    IUpdateBankSettingsOutput,
    IUpdateBankSettingsInput
  >(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      const { id } = updateBankSettings;

      add({
        colour: 'success',
        message: t('select-account.success'),
      });

      history.push(`/my-companies/settings/${id}`);
    },
  });
  const selectAccount = (account: string) => {
    (async () => {
      setSelected(account);

      await mutation({
        variables: {
          input: {
            account,
            id: companyId,
          },
        },
      });
    })();
  };

  if (bankError) {
    return (
      <ErrorCard
        backTo={`/my-companies/settings/${companyId}`}
        title={t('select-account.error')}
        description={t('select-account.error-lead')}
      />
    );
  }

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('select-account.title')}
            subTitle={t('select-account.sub-title')}
          />

          <DataList
            items={data.getBankAccounts.items}
            render={items => (
              <Row>
                {items.map(({ balance, currency, id, type }) => (
                  <Col key={id}>
                    <Card>
                      <Row>
                        <Col sm={6} verticalAlign="middle">
                          <Typography
                            component="h3"
                            variant="h4"
                            margin={balance ? 'md' : 'none'}
                          >
                            {type}
                          </Typography>

                          {balance && (
                            <Typography
                              component="p"
                              variant="lead"
                              margin="none"
                            >
                              {t('select-account.balance')}:{' '}
                              <Currency currency={currency} value={balance} />
                            </Typography>
                          )}
                        </Col>
                        <Col sm={6} align="right" verticalAlign="middle">
                          <Button
                            loading={selected === id}
                            disabled={selected !== ''}
                            onClick={() => selectAccount(id)}
                          >
                            {t('select-account.link-account')}
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          />
        </>
      )}
    </Connected>
  );
};

export default memo(SelectAccount);
