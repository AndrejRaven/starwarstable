/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, Typography } from '@mui/material/';

class PeopleTable extends React.Component {
  componentDidMount() {
    const { fetchPeople } = this.props;

    fetchPeople();
  }

  render() {
    const classes = this.props;

    const Wrapper = (props) => (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h3" align="center">
              Charakters
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {props.children}
          </Grid>
        </Grid>
      </div>
    );

    return <Wrapper />;
  }
}

export default PeopleTable;
