import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { StatusBullet } from 'components';
import { FirebaseContext } from '../../../../config/Firebase';


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));



const statusColors = {
  In_Transit: 'primary',
  In_Transport: 'info',
  Awaiting_Pickup: 'warning',
  In_Warehouse: 'neutral',
  Complete: 'success',
};


const LatestOrders = props => {
  const contextValue = useContext(FirebaseContext);

  const { className, ...rest } = props;

  const classes = useStyles();

  const [reportSales, setReportSales] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await contextValue.db.collection('report-sales').
          onSnapshot(snapshot => {
            var reportSalesArray = [];
            snapshot.forEach(doc => {
              const id = doc.id;
              const data = doc.data();
              reportSalesArray.push({ id, ...data });
            })
            setReportSales(reportSalesArray);
          })

      } catch (error) {
        console.log(error);
      }
    })()
  }, [])


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button
            color="primary"
            size="small"
            variant="outlined"
          >
            New entry
          </Button>
        }
        title="Latest Report Views"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer NIC</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Date and Time
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Report Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportSales && reportSales.map(sale => (
                  <TableRow
                    hover
                    key={sale.id}
                  >
                    <TableCell>{sale.customerNic}</TableCell>
                    <TableCell>
                      {sale.transactionTime}
                    </TableCell>
                    <TableCell>
                      {sale.vehicleReg}
                    </TableCell>
                    <TableCell>
                      $ {sale.paymentUSD}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
