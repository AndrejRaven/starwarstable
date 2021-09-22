import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material/';

const MainLayout = ({ children }) => {
  return <Container maxWidth="xl">{children}</Container>;
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
