import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { FirebaseContext } from '../../config/Firebase';
import clsx from 'clsx';
import { AccountProfile, AccountDetails, TransactionTable, UserInfo } from './components';


import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Grid,
  TextField
} from '@material-ui/core';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();


  const contextValue = useContext(FirebaseContext);

  const [searchType, setSearchType] = useState("nic");
  const [searchString, setSearchString] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [mechanicTransactions, setMechanicTransactions] = useState(null);
  const [serviceTypes, setServiceTypes] = useState(null)
  const [vehilceCategories, setVehicleCategories] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUserInfo, setSelectedUserInfo] = useState(null)
  const [shop, setShop] = useState(null)

  const handleSubmit = async () => {
    setFoundUser(null);

    try {
      await contextValue.db.collection('users').where(searchType, "==", searchString).onSnapshot((snapshot) => {
        var usersArray = [];
            snapshot.forEach(doc => {
              const id = doc.id;
              const data = doc.data();
              usersArray.push({ id, ...data });
            })
            console.log("FOUND USER ",usersArray[0])
            setFoundUser(usersArray[0]);
            if(!usersArray[0]){
              alert("Sorry, the user was not found")
            }
        // if (doc.data()) {
        //   setServiceTypes(doc.data())
        // }
      })
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    (async () => {
      console.log(selectedUserInfo)
    })()
  }, [selectedUserInfo])

useEffect(() => {
  (async () => {
    let user = await contextValue.auth.currentUser
    setCurrentUser(user)
  })()
}, [])

useEffect(() => {
  (async () => {
    if (foundUser && currentUser) {
      try {
        await fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/adminsdk/getuserdata?userid=${foundUser.uid}&authkey=${currentUser.uid}`)
          .then(response => response.json())
          .then(data => setSelectedUserInfo(data));
      } catch (error) {
        console.log(error);
      }
    }
  })()
}, [foundUser, currentUser])

useEffect(() => {
  (async () => {
    if (foundUser) {
      try {
        await contextValue.db.collection('mechanic-transactions').where("mechanic", "==", foundUser.uid)
          .onSnapshot(snapshot => {
            var transactionsArray = [];
            snapshot.forEach(doc => {
              const id = doc.id;
              const data = doc.data();
              transactionsArray.push({ id, ...data });
            })
            setMechanicTransactions(transactionsArray);
          })
      } catch (error) {
        console.log(error);
      }
    } else {
      setMechanicTransactions(null)
    }

  })()
}, [foundUser])

useEffect(() => {
  (async () => {
    try {
      await contextValue.db.collection('constants').doc('service-types').onSnapshot((doc) => {
        if (doc.data()) {
          setServiceTypes(doc.data())
        }
      })
    } catch (error) {
      console.log(error);
    }
  })()
}, [])

useEffect(() => {
  (async () => {
    try {
      await contextValue.db.collection('constants').doc('vehicle-categories').onSnapshot((doc) => {
        if (doc.data()) {
          setVehicleCategories(doc.data())
        }
      })
    } catch (error) {
      console.log(error);
    }
  })()
}, [])

useEffect(() => {
  (async () => {
    if (foundUser) {
      try {
        await contextValue.db.collection('shops').where("uid", "==", foundUser.uid)
          .onSnapshot(snapshot => {
            var shopsArray = [];
            snapshot.forEach(doc => {
              const id = doc.id;
              const data = doc.data();
              shopsArray.push({ id, ...data });
            })
            setShop(shopsArray[0]);
          })
      } catch (error) {
        console.log(error);
      }
    } else {
      setShop(null)
    }

  })()
}, [foundUser])

return (
  <div className={classes.root}>
    <Grid
      container
      spacing={4}>
      <Grid
        item
        lg={4}
        md={6}
        xl={4}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardHeader
            title="Find User"
          />
          <Divider />
          <CardContent>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
                fullWidth
              >
                <MenuItem value={"nic"}>NIC</MenuItem>
                <MenuItem value={"uid"}>User ID</MenuItem>
                <MenuItem value={"mobile"}>Mobile</MenuItem>
                <MenuItem value={"email"}>Email</MenuItem>
              </Select>
              <TextField
                id="outlined-number"
                label="Search For"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(event) => {
                  setSearchString(event.target.value)
                }}
                value={searchString}
                margin="normal"
              />
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
              Find User
            </Button>
          </CardContent>
          <Divider />
        </Card>
      </Grid>
      <Grid
        item
        lg={8}
        md={6}
        xl={8}
        xs={12}
      >
        {selectedUserInfo && serviceTypes && vehilceCategories ? <UserInfo selectedUserInfo={selectedUserInfo} shop={shop} serviceTypes={serviceTypes} vehilceCategories={vehilceCategories}/> : null}

      </Grid>
    </Grid>
    <Grid
      container
      spacing={4}
    >
      <Grid
        item
        lg={4}
        md={6}
        xl={4}
        xs={12}
      >
        {foundUser ? (<AccountProfile foundUser={foundUser} />) : null}


      </Grid>
      <Grid
        item
        lg={8}
        md={6}
        xl={8}
        xs={12}
      >
        {foundUser ? (<AccountDetails foundUser={foundUser} />) : null}

      </Grid>
    </Grid>

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
        {mechanicTransactions && serviceTypes && foundUser && foundUser.userType == "Mechanic" ? (<TransactionTable transactions={mechanicTransactions} serviceTypes={serviceTypes} />) : null}
      </Grid>

    </Grid>
  </div>
);
};

export default Account;
