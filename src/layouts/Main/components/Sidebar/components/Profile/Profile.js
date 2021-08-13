import React, {useState, useEffect, useContext} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { FirebaseContext } from 'config/Firebase';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const contextValue = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    (async () => {
      let user = await contextValue.auth.currentUser
      setCurrentUser(user)
    })()
  }, [])

  useEffect(() => {
    (async () => {
        try {
          let dbInfoData = await contextValue.db.collection('users').doc(currentUser.uid).get()
          let userInfoFromDb = await dbInfoData.data()
          setProfile(userInfoFromDb)
        } catch (error) {
          console.log(error);
        }
      
    })()
  }, [currentUser])

  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src='/images/avatars/avatar_person.png'
        to="/settings"
      />
      {profile? 
      <>
       <Typography
        className={classes.name}
        variant="h4"
      >
        {profile.fName} {profile.lName}
      </Typography>
      <Typography variant="body2">{profile.email}</Typography>
      </>
      :null}
     
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
