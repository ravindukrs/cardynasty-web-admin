import React, { useState, useEffect, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import MechanicIcon from '@material-ui/icons/Build';
import VehicleIcon from '@material-ui/icons/DriveEta';
import OwnerIcon from '@material-ui/icons/Face';
import { FirebaseContext } from '../../../../config/Firebase';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const UsersByDevice = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary
    }
  };

  const contextValue = useContext(FirebaseContext);

  const [devices, setDevices] = useState(null);
  const [data, setData] = useState(null);
  const [userCount, setUserCount] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        contextValue.db.collection('users').
          onSnapshot(snapshot => {
            var userCount = 0;
            var ownerCount = 0;
            var mechanicCount = 0;
            var otherCount = 0;
            snapshot.forEach(doc => {
              userCount++;
              if (doc.data().userType === "Owner") {
                ownerCount++;
              } else if (doc.data().userType === "Mechanic") {
                mechanicCount++;
              } else {
                otherCount++;
              }
            })
            setUserCount(userCount);
            setDevices([
              {
                title: 'Mechanics',
                value: mechanicCount.toString(),
                icon: <MechanicIcon />,
                color: theme.palette.primary.main
              },
              {
                title: 'Owners',
                value: ownerCount.toString(),
                icon: <OwnerIcon />,
                color: theme.palette.error.main
              },
              {
                title: 'Other',
                value: otherCount.toString(),
                icon: <VehicleIcon />,
                color: theme.palette.warning.main
              }
            ])
          })

      } catch (error) {
        console.log(error);
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (devices) {
          setData({
            datasets: [
              {
                data: [devices[0].value, devices[1].value, devices[2].value],
                backgroundColor: [
                  theme.palette.primary.main,
                  theme.palette.error.main,
                  theme.palette.warning.main
                ],
                borderWidth: 8,
                borderColor: theme.palette.white,
                hoverBorderColor: theme.palette.white
              }
            ],
            labels: ['Mechanics', 'Owners', 'Others']
          })
        }
      } catch (error) {
        console.log(error);
      }
    })()
  }, [devices])

  return (

    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        }
        title="Users Types"
      />
      <Divider />
      <CardContent>
      {data? (
        <div className={classes.chartContainer}>
          <Doughnut
            data={data}
            options={options}
          />
        </div>
      ) : null}
        <div className={classes.stats}>
          {devices && userCount && devices.map(device => (
            <div
              className={classes.device}
              key={device.title}
            >
              <span className={classes.deviceIcon}>{device.icon}</span>
              <Typography variant="body1">{device.title}</Typography>
              <Typography
                style={{ color: device.color }}
                variant="h2"
              >
                {Math.round(device.value/userCount*100)}%
                </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string
};

export default UsersByDevice;
