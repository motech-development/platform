import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Col,
  LinkButton,
  PageTitle,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import GET_BANKS, { IGetBanksOutput } from '../../../graphql/bank/GET_BANKS';
import CONNECT_TO_BANK, {
  IConnectToBankInput,
  IConnectToBankOutput,
} from '../../../graphql/bank/CONNECT_TO_BANK';
import ON_CONNECT_TO_BANK, {
  IOnConnectToBankOutput,
} from '../../../graphql/bank/ON_CONNECT_TO_BANK';
import withLayout from '../../../hoc/withLayout';

interface ISelectBankParams {
  companyId: string;
}

// TODO: Do not allow access if already connected
const SelectBank: FC = () => {
  const { companyId } = useParams<ISelectBankParams>();
  const { t } = useTranslation('settings');
  const [selected, setSelected] = useState('');
  const { data, error, loading } = useQuery<IGetBanksOutput>(GET_BANKS);
  const [mutation] = useMutation<IConnectToBankOutput, IConnectToBankInput>(
    CONNECT_TO_BANK,
  );
  const { data: subscription, loading: subscriptionLoading } = useSubscription<
    IOnConnectToBankOutput
  >(ON_CONNECT_TO_BANK);
  const connect = (bank: string) => {
    (async () => {
      setSelected(bank);

      await mutation({
        variables: {
          input: {
            bank,
            callback: `${window.location.origin}/my-companies/settings/${companyId}/select-account`,
            companyId,
          },
        },
      });
    })();
  };

  useEffect(() => {
    if (subscription) {
      const { authorisationUrl } = subscription.onConnectToBank;

      window.location.href = authorisationUrl;
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
            {data.getBanks.items.map(({ id, name }) => (
              <Col key={id}>
                <Card>
                  <Row>
                    <Col xs={6} verticalAlign="middle">
                      <Typography component="h3" variant="h4" margin="none">
                        {name}
                      </Typography>
                    </Col>
                    <Col xs={6} align="right">
                      <Button
                        loading={selected === id}
                        disabled={selected !== ''}
                        onClick={() => connect(id)}
                      >
                        {t('select-bank.connect')}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}

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
          </Row>
        </>
      )}
    </Connected>
  );
};

export default withLayout(SelectBank);
