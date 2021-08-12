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

const ServiceTypes = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const contextValue = useContext(FirebaseContext);
  const [serviceObject, setServiceObject] = useState()
  const [serviceRowArray, setServiceRowArray] = useState()
  const [changeObject, setChangeObject] = useState({})

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'service',
      headerName: 'Service Type',
      width: 150,
      editable: true,
    },
  ]


  useEffect(() => {
    (async () => {
      try {
        await contextValue.db.collection('constants').doc('service-types').
          onSnapshot(snapshot => {
            console.log(snapshot.data())
            if (snapshot.data()) {
              setServiceObject(snapshot.data())
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
      if (serviceObject) {
        let tempServiceRowArray = []
        Object.entries(serviceObject).map(([key, value]) => {
          tempServiceRowArray.push({
            id: key,
            service: value
          })
        })
        setServiceRowArray(tempServiceRowArray)
      }
    })()
  }, [serviceObject])

  useEffect(() => {
    console.log("Service Row Array is Updated")
    console.log(serviceRowArray)
  }, [serviceRowArray])

  const handleChanges = async (values, event) => {
    let tempChangeObject = await Object.assign({}, changeObject);

    tempChangeObject[values.id] = values.value
    setChangeObject(tempChangeObject)
    console.log(tempChangeObject)

  }

  const handleSave = async () => {
    if (Object.keys(changeObject).length === 0 && changeObject.constructor === Object) {
      console.log("sellers is empty!");
    } else {
      await contextValue.db.collection('constants').doc("service-types").update(changeObject).then(() => { alert("New details have been updated") })
    }
  }

  const renderDataGrid = () => {
    return (

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={serviceRowArray}
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
              subheader="Manage Service Types"
              title="Services Available"
            />
            <Divider />
            <CardContent>
              {serviceObject && serviceRowArray ? renderDataGrid() : null}
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

ServiceTypes.propTypes = {
  className: PropTypes.string
};

export default ServiceTypes;
