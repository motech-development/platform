import { gql, useQuery } from '@apollo/client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@motech-development/auth';
import { useLazyGet } from '@motech-development/axios-hooks';
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
  useToast,
} from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import ON_NOTIFICATION, {
  IOnNotificationInput,
  IOnNotificationOutput,
} from '../../../graphql/notifications/ON_NOTIFICATION';
import useQs from '../../../hooks/qs';

interface IReport {
  createdAt: string;
  downloadUrl: string;
  id: string;
  ttl: number;
}

interface IGetReportsInput {
  id: string;
  count?: number;
  nextToken?: string;
}

interface IGetReportsOutput {
  getReports?: {
    id: string;
    items: IReport[];
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
        downloadUrl
        id
        ttl
      }
    }
  }
`;

const Reports: FC = () => {
  const { companyId } = useParams<IReportsParams>();
  const { user } = useAuth();
  const { add } = useToast();
  const { t } = useTranslation('reports');
  const { parse } = useQs();
  const [download] = useLazyGet<Blob>({
    onCompleted: (data) => {
      saveAs(data, 'report.zip');

      add({
        colour: 'success',
        message: t('download.success'),
      });
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('download.error'),
      });
    },
    responseType: 'blob',
  });
  const { data, error, loading, subscribeToMore } = useQuery<
    IGetReportsOutput,
    IGetReportsInput
  >(GET_REPORTS, {
    variables: {
      id: companyId,
    },
  });

  useEffect(() => {
    subscribeToMore<IOnNotificationOutput, IOnNotificationInput>({
      document: ON_NOTIFICATION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data?.onNotification || !prev.getReports) {
          return prev;
        }

        const payload = parse<IReport>(
          subscriptionData.data.onNotification.payload,
        );

        return {
          getReports: {
            ...prev.getReports,
            items: [...prev.getReports.items, payload],
          },
        };
      },
      variables: {
        owner: user!.sub,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                row={({ createdAt, downloadUrl, ttl }) => (
                  <>
                    <TableCell>
                      <DateTime format="dd/MM/yyyy HH:mm" value={createdAt} />
                    </TableCell>

                    <TableCell>
                      <DateTime format="dd/MM/yyyy HH:mm" value={ttl} />
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        onClick={async () => download(downloadUrl)}
                      >
                        {t('reports.download')}
                      </Button>
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
