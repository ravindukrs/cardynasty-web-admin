import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable, Password, UserProperties } from './components';

import { FirebaseContext } from '../../config/Firebase';
import {
  Grid, Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  // const [users] = useState(mockData);
  const contextValue = useContext(FirebaseContext);
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUserInfo, setSelectedUserInfo] = useState(null)
  const [selectedUserDBInfo, setSelectedUserDBInfo] = useState(null)


  useEffect(() => {
    (async () => {
      let user = await contextValue.auth.currentUser
      setCurrentUser(user)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (selectedUser) {
        try {
          let dbInfoData = await contextValue.db.collection('users').doc(selectedUser).get()
          let userInfoFromDb = await dbInfoData.data()
          setSelectedUserDBInfo(userInfoFromDb)
        } catch (error) {
          console.log(error);
        }
      }
    })()
  }, [selectedUser])

  useEffect(() => {
    (async () => {
      if (selectedUser && currentUser) {
        console.log("Selected User Changed, ", selectedUser)
        try {
          await fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/adminsdk/getuserdata?userid=${selectedUser}&authkey=${currentUser.uid}`)
            .then(response => response.json())
            .then(data => setSelectedUserInfo(data));
          console.log(userData)
        } catch (error) {
          console.log(error);
        }
      }
    })()
  }, [selectedUser])


  useEffect(() => {
    (async () => {
      try {
        await contextValue.db.collection('users')
          .onSnapshot(snapshot => {
            var usersArray = [];
            snapshot.forEach(doc => {
              const id = doc.id;
              const data = doc.data();
              usersArray.push({ id, ...data });
            })
            setUsers(usersArray);
          })
      } catch (error) {
        console.log(error);
      }
    })()
  }, [])

  const updatePassword = async (values) => {
    //Try to update auth API
    let responseFromAPI = null

    try {
      await fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/adminsdk/updateemailandpassword?userid=${selectedUser}&authkey=${currentUser.uid}&email=${values.email}&password=${values.password}`)
        .then(response => response.json())
        .then(data => {
          responseFromAPI = data
        });
      console.log("Response From API ", responseFromAPI)
      if (responseFromAPI.uid) {
        alert("Email & Password Updated")
      } else {
        alert("Sorry, Error Occured")
      }
    } catch (error) {
      console.log(error);
      alert("Sorry, Error Occured")
    }

    //Try to Update DB
    if (responseFromAPI.uid) {
      try {
        await contextValue.db.collection('users').doc(responseFromAPI.uid).update({ email: values.email })
      } catch (error) {
        console.log(error);
      }

    }
  }


  const updateUserProfile = async (values) => {

    //Try to Update DB

    try {
      await contextValue.db.collection('users').doc(selectedUser).update(values)
      alert("Updated User Profile")
    } catch (error) {
      console.log(error);
      alert("Failed Updating User Profile")
    }

  }


  if (users) {
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <div className={classes.content}>
              <UsersTable users={users} setSelected={setSelectedUser} />
            </div>
          </Grid>
          <Grid
            item
            lg={4}
            md={4}
            xl={6}
            xs={12}
          >
            {selectedUserInfo && selectedUser ? <Password selectedUserInfo={selectedUserInfo} updatePassword={updatePassword} /> : null}

          </Grid>
          <Grid
            item
            lg={8}
            md={8}
            xl={6}
            xs={12}
          >
            {selectedUserDBInfo && selectedUser ? <UserProperties selectedUserDBInfo={selectedUserDBInfo} updateUserProfile={updateUserProfile} /> : null}

          </Grid>
          {/* <UsersToolbar /> */}
        </Grid>

      </div>
    );
  } else {
    return null
  }

};

export default UserList;
