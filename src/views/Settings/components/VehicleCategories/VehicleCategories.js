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
  TableSortLabel
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

const VehicleCategories = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const contextValue = useContext(FirebaseContext);
  const [vehicleCategoriesObject, setVehicleCategoriesObject] = useState()
  const [vehicleCategoriesRowArray, setVehicleCategoriesRowArray] = useState()
  const [changeObject, setChangeObject] = useState({})

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'category',
      headerName: 'Vehicle Category',
      width: 150,
      editable: true,
    },
  ]


  useEffect(() => {
    (async () => {
      try {
        await contextValue.db.collection('constants').doc('vehicle-categories').
          onSnapshot(snapshot => {
            console.log(snapshot.data())
            if (snapshot.data()) {
              setVehicleCategoriesObject(snapshot.data())
              setChangeObject(snapshot.data())
            }
          })

      } catch (error) {
        console.log(error);
      }
    })()
  }, [])


  useEffect(() => {
    (async () => {
      if (vehicleCategoriesObject) {
        let tempVehicleCategoriesArray = []
        Object.entries(vehicleCategoriesObject).map(([key, value]) => {
          tempVehicleCategoriesArray.push({
            id: key,
            category: value
          })
        })
        setVehicleCategoriesRowArray(tempVehicleCategoriesArray)
      }
    })()
  }, [vehicleCategoriesObject])

  useEffect(() => {
    console.log("Vehicle Category Row Array is Updated")
    console.log(vehicleCategoriesRowArray)
  }, [vehicleCategoriesRowArray])

  const handleChanges = async (values, event) => {
    let tempChangeObject = await Object.assign({}, changeObject);

    tempChangeObject[values.id] = values.value
    setChangeObject(tempChangeObject)
    console.log(tempChangeObject)

  }

  const handleSave = async () => {
    if (Object.keys(changeObject).length === 0 && changeObject.constructor === Object) {
      console.log("Changes Array is empty!");
    } else {
      await contextValue.db.collection('constants').doc("vehicle-categories").update(changeObject).then(() => { alert("Vehicle Categories has been updated") })
    }
  }

  const renderDataGrid = () => {
    return (

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={vehicleCategoriesRowArray}
          columns={columns}
          onCellEditCommit={(values, event) => {
            handleChanges(values, event)
          }}
        />
      </div>
    )
  }

  return (
   
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >

          <form>
            <CardHeader
              subheader="Manage Vehicle Categories"
              title="Categories Available"
            />
            <Divider />
            <CardContent>
              {vehicleCategoriesObject && vehicleCategoriesRowArray ? renderDataGrid() : null}
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => handleSave()}
              >
                Update
              </Button>
            </CardActions>
          </form>
        </Card>

  );
};

VehicleCategories.propTypes = {
  className: PropTypes.string
};

export default VehicleCategories;
