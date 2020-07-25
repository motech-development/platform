import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { IonItem, IonLabel } from '@ionic/react';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Connected from '../components/Connected';
import DataList from '../components/DataList';
import Page from '../components/Page';

interface IGetCompaniesInput {
  count?: number;
  nextToken?: string;
}

interface IGetCompaniesOutput {
  getCompanies: {
    id: string;
    items: {
      companyNumber: string;
      id: string;
      name: string;
    }[];
  };
}

export const GET_COMPANIES = gql`
  query GetCompanies {
    getCompanies {
      id
      items {
        companyNumber
        id
        name
      }
    }
  }
`;

const MyCompanies: FC = () => {
  const { t } = useTranslation('my-companies');
  const { data, error, loading } = useQuery<
    IGetCompaniesOutput,
    IGetCompaniesInput
  >(GET_COMPANIES);

  return (
    <Connected error={error} loading={loading}>
      <Page title={t('title')}>
        {data && (
          <DataList
            items={data.getCompanies.items}
            noResults={t('no-results')}
            row={({ companyNumber, id, name }) => (
              <IonItem key={id} routerLink={`transactions/${id}`}>
                <IonLabel>
                  <h2>{name}</h2>

                  <p>{companyNumber}</p>
                </IonLabel>
              </IonItem>
            )}
          />
        )}
      </Page>
    </Connected>
  );
};

export default memo(MyCompanies);
