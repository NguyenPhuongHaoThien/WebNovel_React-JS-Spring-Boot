// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!roles.includes(userRole)) {
    // User does not have the required role, show access denied message
    return (
      <Alert variant="danger" className="mt-3 error-alert">
        <Alert.Heading>Access Denied!</Alert.Heading>
        <p>You don't have the required role to access this page.</p>
      </Alert>
    );
  }

  // User is logged in and has the required role, render the component
  return <Component {...rest} />;
};

export default PrivateRoute;