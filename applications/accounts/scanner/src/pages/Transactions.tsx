import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { Currency, DateTime } from '@motech-development/breeze-ui';
import {
  chevronBackOutline,
  chevronForwardOutline,
  receiptOutline,
} from 'ionicons/icons';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../components/Connected';
import DataList from '../components/DataList';
import Page from '../components/Page';

interface IGetTransactionsInput {
  id: string;
}

interface IGetTransactionsOutput {
  getBalance: {
    balance: number;
    currency: string;
    id: string;
    transactions: {
      balance: number;
      currency: string;
      date: string;
      items: {
        amount: number;
        attachment: string;
        description: string;
        id: string;
        name: string;
      }[];
    }[];
  };
  getCompany: {
    id: string;
    name: string;
  };
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($id: ID!) {
    getBalance(id: $id) {
      balance
      currency
      id
      transactions {
        balance
        currency
        date
        items {
          amount
          attachment
          description
          id
          name
        }
      }
    }
    getCompany(id: $id) {
      id
      name
    }
  }
`;

interface ITransactionsParams {
  companyId: string;
}

const Transactions: FC = () => {
  const { t } = useTranslation('transactions');
  const { companyId } = useParams<ITransactionsParams>();
  const { data, error, loading } = useQuery<
    IGetTransactionsOutput,
    IGetTransactionsInput
  >(GET_TRANSACTIONS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <Page title={data.getCompany.name} defaultHref="/my-companies">
          <IonFab horizontal="end" vertical="bottom" slot="fixed">
            <IonFabButton
              color="secondary"
              routerLink={`transactions/${companyId}/add`}
            >
              <IonIcon icon={receiptOutline} />
            </IonFabButton>
          </IonFab>

          <IonCard
            className="ion-text-center"
            color={data.getBalance.balance > 0 ? 'success' : 'danger'}
          >
            <IonCardHeader>
              <IonCardTitle>{t('balance')}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <Currency
                currency={data.getBalance.currency}
                value={data.getBalance.balance}
              />
            </IonCardContent>
          </IonCard>

          <DataList
            items={data.getBalance.transactions}
            noResults={t('no-results')}
            row={({ balance, currency, date, items }) => (
              <>
                <IonItemDivider>
                  <IonLabel>
                    <DateTime format="dddd, DD MMMM" value={date} />
                  </IonLabel>

                  <IonNote slot="end">
                    <Currency currency={currency} value={balance} />
                  </IonNote>
                </IonItemDivider>

                {items.map(item => (
                  <IonItem
                    key={item.id}
                    routerLink={`/transactions/${companyId}/view/${item.id}`}
                  >
                    <IonIcon
                      icon={
                        item.amount < 0
                          ? chevronBackOutline
                          : chevronForwardOutline
                      }
                      color={item.amount < 0 ? 'danger' : 'success'}
                      slot="start"
                    />

                    <IonLabel>
                      {/* TODO: Display alert for no receipt */}
                      <h2>{item.name}</h2>

                      <p>{item.description}</p>
                    </IonLabel>

                    <IonNote slot="end">
                      <Currency currency={currency} value={item.amount} />
                    </IonNote>
                  </IonItem>
                ))}
              </>
            )}
          />
        </Page>
      )}
    </Connected>
  );
};

export default memo(Transactions);
