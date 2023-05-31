import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useQs } from '@motech-development/query-string-hook';
import { saveAs } from 'file-saver';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import ON_NOTIFICATION, {
  IOnNotificationInput,
  IOnNotificationOutput,
} from '../../../graphql/notifications/ON_NOTIFICATION';
import invariant from '../../../utils/invariant';

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

interface IDataRow {
  download: (url: string) => Promise<Blob | undefined>;
  label: string;
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

function row({ download, label }: IDataRow) {
  function DataRow({ createdAt, downloadUrl, ttl }: Exclude<IReport, 'id'>) {
    return (
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
            onClick={() => {
              download(downloadUrl).catch(() => {});
            }}
          >
            {label}
          </Button>
        </TableCell>
      </>
    );
  }

  return DataRow;
}

function Reports() {
  const { companyId } = useParams();

  invariant(companyId);

  const renderCheck = process.env.NODE_ENV === 'development' ? 2 : 1;
  const renderCount = useRef(0);
  const { user } = useAuth0();
  const { add } = useToast();
  const { t } = useTranslation('reports');
  const { parse } = useQs<IReport>();
  const [download] = useLazyGet<Blob>({
    onCompleted: (blob) => {
      saveAs(blob, 'report.zip');

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
    let unsubscribe: () => void;

    renderCount.current += 1;

    if (renderCount.current >= renderCheck) {
      unsubscribe = subscribeToMore<
        IOnNotificationOutput,
        IOnNotificationInput
      >({
        document: ON_NOTIFICATION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data?.onNotification || !prev.getReports) {
            return prev;
          }

          const payload = parse(subscriptionData.data.onNotification.payload);
          const result = [...prev.getReports.items, payload];
          const items = result.filter(
            (a, index) => result.findIndex((b) => a.id === b.id) === index,
          );

          return {
            getReports: {
              ...prev.getReports,
              items,
            },
          };
        },
        variables: {
          owner: user?.sub as string,
        },
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
                row={row({
                  download,
                  label: t('reports.download'),
                })}
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
}

export default Reports;
