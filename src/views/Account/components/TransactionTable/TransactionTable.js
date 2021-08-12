import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { StatusBullet } from 'components';

import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const statusColors = {
  Mechanic_Pay: 'primary',
  Mechanic_Withdrawal: 'success'
};

const TransactionTable = props => {
  const { className, transactions, serviceTypes, ...rest } = props;
  const classes = useStyles();

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { transactions } = props;

    let selectedTransactions;

    if (event.target.checked) {
      selectedTransactions = transactions.map(transaction => transaction.id);
    } else {
      selectedTransactions = [];
    }

    setSelectedTransactions(selectedTransactions);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTransactions.indexOf(id);
    let newSelectedTransactions = [];

    if (selectedIndex === -1) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions, id);
    } else if (selectedIndex === 0) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions.slice(1));
    } else if (selectedIndex === selectedTransactions.length - 1) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTransactions = newSelectedTransactions.concat(
        selectedTransactions.slice(0, selectedIndex),
        selectedTransactions.slice(selectedIndex + 1)
      );
    }

    setSelectedTransactions(newSelectedTransactions);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const printServices = (services) => {
    let servicesArr = []
    services.forEach(service => {
      servicesArr.push(serviceTypes[service])
    })
    return servicesArr.join(", ")
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTransactions.length === transactions.length}
                      color="primary"
                      indeterminate={
                        selectedTransactions.length > 0 &&
                        selectedTransactions.length < transactions.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Transaction Type</TableCell>
                  <TableCell>Associated Vehicle</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Services</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, rowsPerPage).map(transaction => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={transaction.id}
                    selected={selectedTransactions.indexOf(transaction.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedTransactions.indexOf(transaction.id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, transaction.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                    <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[transaction.type.replace(/ /g, "_")]}
                          size="sm"
                        />
                        {transaction.type}
                      </div>
                      
                    </TableCell>
                    <TableCell>{transaction.regNumber}</TableCell>
                    <TableCell>
                      {transaction.stamp}
                    </TableCell>
                    <TableCell>LKR {transaction.value}</TableCell>
                    <TableCell>
                      {transaction.services? printServices(transaction.services) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={transactions.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

TransactionTable.propTypes = {
  className: PropTypes.string,
  transactions: PropTypes.array.isRequired
};

export default TransactionTable;
