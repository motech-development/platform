// TODO: Create a subscription to reload the list when report is ready
import { gql, useQuery } from '@apollo/client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Button,
  Col,
  DataTable,
  DateTime,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
} from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';

interface IGetReportsInput {
  id: string;
  count?: number;
  nextToken?: string;
}

interface IGetReportsOutput {
  getReports?: {
    id: string;
    items: {
      createdAt: string;
      id: string;
      ttl: string;
    }[];
  };
}

interface IReportsParams {
  companyId: string;
}

export const GET_REPORTS = gql`
  query GetReports($id: ID!, $count: Int, $nextToken: String) {
    getReports(id: $id, count: $count, nextToken: $nextToken) {
      id
      items {
        createdAt
        id
        ttl
      }
    }
  }
`;

const Reports: FC = () => {
  const { companyId } = useParams<IReportsParams>();
  const { t } = useTranslation('reports');
  const { data, error, loading } = useQuery<
    IGetReportsOutput,
    IGetReportsInput
  >(GET_REPORTS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data?.getReports && (
        <>
          <PageTitle
            title={t('reports.title')}
            subTitle={t('reports.sub-title')}
          />

          <Alert
            colour="primary"
            icon={<FontAwesomeIcon icon={faExclamationCircle} />}
            message={t('reports.expiry-message')}
          />

          <Row>
            <Col>
              <DataTable
                items={data.getReports.items}
                header={
                  <>
                    <TableCell as="th">{t('reports.table.created')}</TableCell>

                    <TableCell as="th">{t('reports.table.expires')}</TableCell>

                    <TableCell as="th">{t('reports.table.actions')}</TableCell>
                  </>
                }
                row={({ createdAt, ttl }) => (
                  <>
                    <TableCell>
                      <DateTime format="DD/MM/YYYY HH:mm" value={createdAt} />
                    </TableCell>

                    <TableCell>
                      <DateTime format="DD/MM/YYYY HH:mm" value={ttl} />
                    </TableCell>

                    <TableCell>
                      {/* TODO: Download report */}
                      <Button size="sm">{t('reports.download')}</Button>
                    </TableCell>
                  </>
                )}
                noResults={
                  <Alert
                    colour="secondary"
                    icon={<FontAwesomeIcon icon={faExclamationCircle} />}
                    message={t('reports.no-reports-found')}
                  />
                }
              />
            </Col>

            <Col>
              <Row>
                <Col xs={12} md={4} mdOffset={5} lg={3} lgOffset={7}>
                  <LinkButton
                    block
                    to={`/my-companies/reports/${companyId}/create-report`}
                    size="lg"
                  >
                    {t('reports.create-report')}
                  </LinkButton>
                </Col>
                <Col xs={12} md={4} lg={3}>
                  <LinkButton
                    block
                    to={`/my-companies/dashboard/${companyId}`}
                    colour="secondary"
                    size="lg"
                  >
                    {t('reports.go-back')}
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

export default memo(Reports);
