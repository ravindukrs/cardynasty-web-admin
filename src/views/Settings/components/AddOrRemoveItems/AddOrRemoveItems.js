import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel, TextField
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';


import { FirebaseContext } from '../../../../config/Firebase';


const useStyles = makeStyles(() => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  table: {
    maxWidth: 350,
  },
}));

const AddOrRemoveItems = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const contextValue = useContext(FirebaseContext);


  const [newVehicleCategory, setNewVehicleCategory] = useState()
  const [newServiceCategory, setNewServiceCategory] = useState()
  const [removeVehicleCategory, setRemoveVehicleCategory] = useState()
  const [removeServiceCategory, setRemoveServiceCategory] = useState()

  const handleAddVehicleCategory = async () => {
    if (newVehicleCategory) {
      let existingCategoriesDoc = await contextValue.db.collection('constants').doc("vehicle-categories").get()
      let existingCategories = await existingCategoriesDoc.data()
      let lastKey = (Object.keys(existingCategories)).slice(-1)[0]
      let newKey = (parseInt(lastKey) + 1).toString()
      existingCategories[newKey] = newVehicleCategory
      console.log(existingCategories)
      await contextValue.db.collection('constants').doc("vehicle-categories").set(existingCategories, { merge: true })
      alert("New vehicle category added")
    } else {
      alert("Sorry, the New Vehicle Category is empty")
    }
  }

  const handleRemoveVehicleCategory = async () => {
    if (removeVehicleCategory) {
      let existingCategoriesDoc = await contextValue.db.collection('constants').doc("vehicle-categories").get()
      let existingCategories = await existingCategoriesDoc.data()
      if (Object.keys(existingCategories).includes(removeVehicleCategory.toString())) {
        delete existingCategories[removeVehicleCategory.toString()]
        await contextValue.db.collection('constants').doc("vehicle-categories").set(existingCategories)
        alert("Vehicle category deleted")
      } else {
        alert("Invalid Key")
      }
    } else {
      alert("Sorry, the Remove Vehicle Category is empty")
    }
  }

  const handleAddServiceCategory = async () => {
    if (newServiceCategory) {
      let existingCategoriesDoc = await contextValue.db.collection('constants').doc("service-types").get()
      let existingCategories = await existingCategoriesDoc.data()
      let lastKey = (Object.keys(existingCategories)).slice(-1)[0]
      let newKey = (parseInt(lastKey) + 1).toString()
      existingCategories[newKey] = newServiceCategory
      console.log(existingCategories)
      await contextValue.db.collection('constants').doc("service-types").set(existingCategories, { merge: true })
      alert("New Service category added")
    } else {
      alert("Sorry, the New Service Category is empty")
    }
  }

  const handleRemoveServiceCategory = async () => {
    if (removeServiceCategory) {
      let existingCategoriesDoc = await contextValue.db.collection('constants').doc("service-types").get()
      let existingCategories = await existingCategoriesDoc.data()
      if (Object.keys(existingCategories).includes(removeServiceCategory.toString())) {
        delete existingCategories[removeServiceCategory.toString()]
        await contextValue.db.collection('constants').doc("service-types").set(existingCategories)
        alert("Service category deleted")
      } else {
        alert("Invalid Key, please try again")
      }
    } else {
      alert("Sorry, the Remove Service Category is empty")
    }
  }
  return (
    <Grid
      container
      direction="column"
      spacing={4}
    >
      {/* Add Vehicle Category */}

      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >

          <form>
            <CardHeader
              title="Add New Vehicle Category"
            />
            <Divider />
            <CardContent>
              <div style={{ height: 80, width: '100%' }}>
                <TextField
                  required
                  name="addVehicleCategory"
                  label="Add New Vehicle Category"
                  fullWidth
                  onChange={(event) => setNewVehicleCategory(event.target.value)} />
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => handleAddVehicleCategory()}
              >
                Add
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
      {/* Remove Vehicle Category */}
      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >

          <form>
            <CardHeader
              title="Remove Vehicle Category"
            />
            <Divider />
            <CardContent>
              <div style={{ height: 80, width: '100%' }}>
                <TextField
                  required
                  name="removeVehicleCategory"
                  label="Category ID"
                  type="number"
                  fullWidth
                  onChange={(event) => setRemoveVehicleCategory(event.target.value)} />
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                style={{borderColor: '#cc0025', color: "#cc0025"}}
                variant="outlined"
                onClick={() => handleRemoveVehicleCategory()}
              >
                Remove
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>

      {/* Add Service Category */}

      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >

          <form>
            <CardHeader
              title="Add New Service Category"
            />
            <Divider />
            <CardContent>
              <div style={{ height: 80, width: '100%' }}>
                <TextField
                  required
                  name="addServiceCategory"
                  label="Add New Service Category"
                  fullWidth
                  onChange={(event) => setNewServiceCategory(event.target.value)} />
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => handleAddServiceCategory()}
              >
                Add
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>

      {/* Remove Vehicle Category */}
      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >

          <form>
            <CardHeader
              title="Remove Service Category"
            />
            <Divider />
            <CardContent>
              <div style={{ height: 80, width: '100%' }}>
                <TextField
                  required
                  name="removeServiceCategory"
                  label="Category ID"
                  type="number"
                  fullWidth
                  onChange={(event) => setRemoveServiceCategory(event.target.value)} />
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                style={{borderColor: '#cc0025', color: "#cc0025"}}
                variant="outlined"
                onClick={() => handleRemoveServiceCategory()}
              >
                Remove
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>

  );
};

AddOrRemoveItems.propTypes = {
  className: PropTypes.string
};

export default AddOrRemoveItems;
