/* eslint-disable */
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

const Password = props => {
  const { className, selectedUserInfo, updatePassword, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    email: '',
    password: '',
    confirm: ''
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    setValues({email: selectedUserInfo.email, password:'', confirm:''})
  }, [selectedUserInfo])

  const handleUpdate = event => {
    let emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let emailValidity =  emailregex.test(values.email);
    if(!emailValidity){
      alert("This email is invalid")
      return;
    } else if(values.password.length < 8){
      alert("The password should have a minimum of 8 characters")
      return;
    } else if (values.password !=  values.confirm){
      alert("The passwords do not match")
      return;
    } else{
      updatePassword(values)
    }
    

  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader={`Update email / password`}
          title="Email and Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Email"
            name="email"
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
            placeholder={selectedUserInfo.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            name="confirm"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.confirm}
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

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
