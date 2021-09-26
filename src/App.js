/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import EnchauncedTable from './components/views/PeopleTable/PeopleTable';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <MainLayout>
        <Switch>
          <Route exact path="/" component={EnchauncedTable} />
        </Switch>
      </MainLayout>
    </BrowserRouter>
  );
}
