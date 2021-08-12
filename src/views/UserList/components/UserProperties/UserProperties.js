import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const UserProperties = props => {
  const { className, selectedUserDBInfo, updateUserProfile, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    fName: "",
    lName: "",
    nic: "",
    mobile: "",
    userType: "",

  });

  useEffect(() => {
    setValues(
      {
        fName: selectedUserDBInfo.fName,
        lName: selectedUserDBInfo.lName,
        nic: selectedUserDBInfo.nic,
        mobile: selectedUserDBInfo.mobile,
        userType: selectedUserDBInfo.userType,
    
      }
    )
  }, [selectedUserDBInfo])


  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleUpdate = event => {
    updateUserProfile(values)
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Update User Properties"
          title="User Properties"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="First Name"
            name="fName"
            onChange={handleChange}
            type="text"
            value={values.fName}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lName"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="text"
            value={values.lName}
            variant="outlined"
          />
           <TextField
            fullWidth
            label="NIC"
            name="nic"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="text"
            value={values.nic}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contact"
            name="mobile"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="number"
            value={values.mobile}
            variant="outlined"
          />
          <TextField
            disabled={true}
            fullWidth
            label="User Type"
            name="userType"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="text"
            value={values.userType}
            variant="outlined"
          />
         
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

UserProperties.propTypes = {
  className: PropTypes.string
};

export default UserProperties;
