import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Col,
  DataTable,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../../components/Connected';
import Currency from '../../../../components/Currency';
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
  const {
    data,
    error: bankError,
    loading,
  } = useQuery<IGetBankAccountsOutput, IGetBankAccountsInput>(
    GET_BANK_ACCOUNTS,
    {
      variables: {
        id: companyId,
      },
    },
  );

  const [mutation, { error }] = useMutation<
    IUpdateBankSettingsOutput,
    IUpdateBankSettingsInput
  >(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      if (updateBankSettings) {
        const { id } = updateBankSettings;

        add({
          colour: 'success',
          message: t('select-account.success'),
        });

        history.push(`/my-companies/settings/${id}`);
      } else {
        add({
          colour: 'danger',
          message: t('select-account.retry'),
        });

        history.push(`/my-companies/settings/${companyId}`);
      }
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
    })().catch(() => {});
  };

  if (bankError) {
    return (
      <ErrorCard
        backTo={`/my-companies/settings/${companyId}`}
        title={t('select-account.errors.failure.title')}
        description={t('select-account.errors.failure.description')}
      />
    );
  }

  return (
    <Connected error={error} loading={loading}>
      {data?.getBankAccounts && (
        <>
          <PageTitle
            title={t('select-account.title')}
            subTitle={t('select-account.sub-title')}
          />

          <Row>
            <Col>
              <DataTable
                items={data.getBankAccounts.items}
                header={
                  <TableCell align="left" as="th" colSpan={2}>
                    {t('select-account.accounts')}
                  </TableCell>
                }
                row={({ balance, currency, id, type }) => (
                  <>
                    <TableCell>
                      <Typography
                        component="p"
                        variant="h6"
                        margin={balance ? 'md' : 'none'}
                      >
                        {type}
                      </Typography>

                      {balance && (
                        <Typography component="p" variant="p" margin="none">
                          {t('select-account.balance')}:{' '}
                          <Currency currency={currency} value={balance} />
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        loading={selected === id}
                        disabled={selected !== ''}
                        onClick={() => selectAccount(id)}
                        size="sm"
                      >
                        {t('select-account.link-account')}
                      </Button>
                    </TableCell>
                  </>
                )}
                noResults={
                  <ErrorCard
                    backTo={`/my-companies/settings/${companyId}`}
                    title={t('select-account.errors.no-accounts.title')}
                    description={t(
                      'select-account.errors.no-accounts.description',
                    )}
                  />
                }
              />
            </Col>

            {data.getBankAccounts.items.length > 0 && (
              <Col>
                <Row>
                  <Col xs={12} md={3} mdOffset={10}>
                    <LinkButton
                      block
                      to={`/my-companies/settings/${companyId}`}
                      colour="secondary"
                      size="lg"
                    >
                      {t('select-accounts.cancel')}
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

export default SelectAccount;
