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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import Currency from '../../../components/Currency';
import DeleteItem from '../../../components/DeleteItem';
import NoTransactions from '../../../components/NoTransactions';
import Scheduled from '../../../components/Scheduled';
import TransactionArrow from '../../../components/TransactionArrow';
import TransactionDetailsCell from '../../../components/TransactionDetailsCell';
import WarningText from '../../../components/WarningText';
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from '../../../graphql/transaction/GET_TRANSACTIONS';
import invariant from '../../../utils/invariant';

interface IDataRow {
  companyId: string;
  data: IGetTransactionsOutput;
  deleteLabel: string;
  launchDeleteModal: (id: string, name: string) => void;
  noAttachmentLabel: string;
  scheduledLabel: string;
  viewLabel: string;
}

interface IDataRowComponent {
  amount: number;
  attachment: string;
  date: string;
  description: string;
  id: string;
  name: string;
  scheduled: boolean;
}

function row({
  companyId,
  data,
  deleteLabel,
  launchDeleteModal,
  noAttachmentLabel,
  scheduledLabel,
  viewLabel,
}: IDataRow) {
  function DataRow({
    amount,
    attachment,
    date,
    description,
    id,
    name,
    scheduled,
  }: IDataRowComponent) {
    return (
      <>
        <TransactionArrow value={amount} />

        <TransactionDetailsCell>
          <WarningText
            id={id}
            component="p"
            margin="none"
            message={noAttachmentLabel}
            placement="right"
            show={!attachment}
            variant="h6"
          >
            {name}
          </WarningText>

          <Typography truncate component="p" variant="p" margin="none">
            {description}
          </Typography>
        </TransactionDetailsCell>

        <TableCell>
          <Scheduled
            id={id}
            message={scheduledLabel}
            placement="right"
            show={scheduled}
            value={date}
          />
        </TableCell>

        {data.getBalance && (
          <TableCell align="right">
            <Currency currency={data.getBalance.currency} value={amount} />
          </TableCell>
        )}

        <TableCell>
          <LinkButton
            data-testid={`View ${name}`}
            to={`/my-companies/accounts/${companyId}/view-transaction/${id}`}
            size="sm"
          >
            {viewLabel}
          </LinkButton>{' '}
          <Button
            data-testid={`Delete ${name}`}
            colour="danger"
            size="sm"
            onClick={() => launchDeleteModal(id, name)}
          >
            {deleteLabel}
          </Button>
        </TableCell>
      </>
    );
  }

  return DataRow;
}

function PendingTransactions() {
  const [transaction, setTransaction] = useState({
    id: '',
    name: '',
  });
  const { t } = useTranslation('accounts');
  const { companyId } = useParams();

  invariant(companyId);

  const { add } = useToast();
  const { data, error, loading } = useQuery<
    IGetTransactionsOutput,
    IGetTransactionsInput
  >(GET_TRANSACTIONS, {
    variables: {
      id: companyId,
      status: 'pending',
    },
  });
  const onDismiss = () => {
    setTransaction({
      id: '',
      name: '',
    });
  };
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('delete-transaction.success'),
      });

      onDismiss();
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('delete-transaction.error'),
      });
    },
  });
  const launchDeleteModal = (id: string, name: string) => {
    setTransaction({
      id,
      name,
    });
  };
  const onDelete = (id: string) => {
    deleteMutation({
      update: updateCache,
      variables: {
        id,
      },
    }).catch(() => {});
  };

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('pending-transactions.title')}
            subTitle={t('pending-transactions.sub-title')}
          />

          <Row>
            {data.getTransactions && (
              <Col>
                <DataTable
                  items={data.getTransactions.items}
                  header={
                    <>
                      <TableCell as="th" colSpan={2}>
                        {t('pending-transactions.transactions.name')}
                      </TableCell>
                      <TableCell as="th">
                        {t('pending-transactions.transactions.date')}
                      </TableCell>
                      <TableCell as="th" align="right">
                        {t('pending-transactions.transactions.amount')}
                      </TableCell>
                      <TableCell as="th">
                        {t('pending-transactions.transactions.actions')}
                      </TableCell>
                    </>
                  }
                  row={row({
                    companyId,
                    data,
                    deleteLabel: t('pending-transactions.transactions.delete'),
                    launchDeleteModal,
                    noAttachmentLabel: t(
                      'pending-transactions.transactions.no-attachment',
                    ),
                    scheduledLabel: t(
                      'pending-transactions.transactions.scheduled',
                    ),
                    viewLabel: t('pending-transactions.transactions.view'),
                  })}
                  noResults={<NoTransactions />}
                />
              </Col>
            )}

            <Col>
              <Row>
                <Col xs={12} md={4} mdOffset={5} lg={3} lgOffset={7}>
                  <LinkButton
                    block
                    to={`/my-companies/accounts/${companyId}/record-transaction`}
                    size="lg"
                  >
                    {t('pending-transactions.record-transaction')}
                  </LinkButton>
                </Col>
                <Col xs={12} md={4} lg={3}>
                  <LinkButton
                    block
                    to={`/my-companies/accounts/${companyId}`}
                    colour="secondary"
                    size="lg"
                  >
                    {t('pending-transactions.go-back')}
                  </LinkButton>
                </Col>
              </Row>
            </Col>
          </Row>

          <DeleteItem
            title={t('delete-transaction.title')}
            warning={t('delete-transaction.warning')}
            display={!!transaction.id}
            loading={deleteLoading}
            name={transaction.name}
            onDelete={() => onDelete(transaction.id)}
            onDismiss={onDismiss}
          />
        </>
      )}
    </Connected>
  );
}

export default PendingTransactions;
