import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { StatusBullet } from 'components';
import "antd/dist/antd.css";
import { Descriptions } from 'antd';

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

const UserInfo = props => {
  const { className, selectedUserInfo, serviceTypes, vehilceCategories, shop, ...rest } = props;
  const classes = useStyles();

  const generateServiceString = () => {
    if (shop && shop.service_categories) {
      let provided_services_array = []
      shop.service_categories.forEach(serviceIndex => {
        provided_services_array.push(serviceTypes[serviceIndex])
      })

      return provided_services_array.join(", ")

    } else {
      return "Not Set"
    }
  }

  const generateVehicleString = () => {
    if (shop && shop.vehicle_categories) {
      let provided_vehicle_array = []
      shop.vehicle_categories.forEach(vehicleIndex => {
        provided_vehicle_array.push(vehilceCategories[vehicleIndex])
      })

      return provided_vehicle_array.join(", ")

    } else {
      return "Not Set"
    }
  }


  return (

    <Descriptions title="User Info" layout="vertical" size="small">
      <Descriptions.Item label="Email Verified" span={2} labelStyle={{ fontWeight: "bold" }}>{selectedUserInfo.emailVerified ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Account Disabled" span={2} labelStyle={{ fontWeight: "bold" }}>{selectedUserInfo.disabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="User Created" span={3} labelStyle={{ fontWeight: "bold" }}>
        {selectedUserInfo.metadata.creationTime}
      </Descriptions.Item>
      <Descriptions.Item label="Last Sign In" span={2} labelStyle={{ fontWeight: "bold" }}>
        {selectedUserInfo.metadata.lastSignInTime}
      </Descriptions.Item>
      <Descriptions.Item label="Active Token Since" span={2} labelStyle={{ fontWeight: "bold" }}>
        {selectedUserInfo.tokensValidAfterTime}
      </Descriptions.Item>
      {shop ?
        <>
          <Descriptions.Item label="Services Provided" span={3} labelStyle={{ fontWeight: "bold" }}>
            {shop.service_categories ? generateServiceString() : "Not Set"}
          </Descriptions.Item>
          <Descriptions.Item label="Vehicles Servicing" span={3} labelStyle={{ fontWeight: "bold" }}>
            {shop.vehicle_categories ? generateVehicleString() : "Not Set"}
          </Descriptions.Item>
          <Descriptions.Item label="Shop Name & Location" span={3} labelStyle={{ fontWeight: "bold" }}>
            {shop.shop_name && shop.shop_location ? `${shop.shop_name}: ${shop.shop_location.formatted_address}` : "Not Set"}
          </Descriptions.Item>
          <Descriptions.Item label="Account Balance" span={3} labelStyle={{ fontWeight: "bold" }}>
            {shop.balance ? `LKR ${shop.balance}` : "Not Set"}
          </Descriptions.Item>
        </>
        : null}

    </Descriptions>
  )
};

UserInfo.propTypes = {
  className: PropTypes.string,
  transactions: PropTypes.array.isRequired
};

export default UserInfo;
