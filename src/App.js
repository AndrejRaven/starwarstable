/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/layout/MainLayout/MainLayout';
import store from './redux/store';
import PeopleTableContainer from './components/views/PeopleTable/PeopleTableContainer';
import EnchauncedTable from './components/views/PeopleTable/PeopleTable1';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <MainLayout>
          <Switch>
            <Route exact path="/" component={PeopleTableContainer} />
            <Route exact path="/a" component={EnchauncedTable} />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </Provider>
  );
}
