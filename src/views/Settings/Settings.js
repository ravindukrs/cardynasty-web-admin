import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField } from '@material-ui/core';

import { ServiceTypes, Password, PayForm, CarrierPricing, WarehousePricing, VehicleCategories, AddOrRemoveItems } from './components';
import clsx from 'clsx';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Settings = (props) => {
  const classes = useStyles();
  const { className, ...rest } = props;

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={4}
          xl={6}
          xs={12}
        >
          <ServiceTypes />
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={6}
          xs={12}
        >
          <VehicleCategories />
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={6}
          xs={12}
        >
          <AddOrRemoveItems />
        </Grid>
        
        {/* <Grid
          item
          md={5}
          xs={12}
        >
          <Password />
        </Grid> */}
        {/* <Grid
          item
          md={4}
          xs={12}
        >
          <PayForm />
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
        >
          <CarrierPricing />
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
        >
          <WarehousePricing />
        </Grid> */}
        
      </Grid>
    </div>
  );
};

export default Settings;
