/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/layout/MainLayout/MainLayout';
import store from './redux/store';
import HeroTable from './components/views/HeroTable/HeroTable';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <MainLayout>
          <Switch>
            <Route exact path="/" component={HeroTable} />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </Provider>
  );
}
