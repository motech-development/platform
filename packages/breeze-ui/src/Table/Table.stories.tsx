import { withA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import TableBody from '../TableBody/TableBody';
import TableCell from '../TableCell/TableCell';
import TableRow from '../TableRow/TableRow';
import Table from './Table';

const data = [
  {
    balance: 500,
    date: '16th April 2019',
    transactions: [
      {
        amount: 150,
        date: '2019-04-16T10:16:10.487Z',
        description: 'Payment from Joe Bloggs',
        id: '48b45431-fecc-459b-948c-414b965289d6',
      },
      {
        amount: -5.25,
        date: '2019-04-17T12:11:10.487Z',
        description: 'Lunch',
        id: '9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72',
      },
    ],
  },
  {
    balance: 644.75,
    date: '20th April 2019',
    transactions: [
      {
        amount: 150,
        date: '2019-04-20T10:16:10.487Z',
        description: 'Payment from Joe Bloggs',
        id: '48b45431-fecc-459b-948c-414b965289d6',
      },
      {
        amount: -5.25,
        date: '2019-04-20T12:11:10.487Z',
        description: 'Lunch',
        id: '9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72',
      },
    ],
  },
];

const stories = storiesOf('Table', module);

stories.addDecorator(withA11y);

stories.add('Basic table', () => (
  <>
    <BaseStyles />

    <Table>
      {data.map(item => (
        <TableBody key={item.date}>
          <TableRow colour="primary">
            <TableCell as="th">Date</TableCell>
            <TableCell as="th">Balance</TableCell>
          </TableRow>

          <TableRow colour="primary">
            <TableCell as="th">{item.date}</TableCell>
            <TableCell as="th">£{item.balance.toString()}</TableCell>
          </TableRow>

          <TableRow colour="secondary">
            <TableCell as="th">Transaction</TableCell>
            <TableCell as="th">Value</TableCell>
          </TableRow>

          {item.transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>£{transaction.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ))}

      <TableBody />
    </Table>
  </>
));
