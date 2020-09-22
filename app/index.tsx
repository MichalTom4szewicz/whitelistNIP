import React, { Fragment } from 'react';
import { render } from 'react-dom';
import './app.global.css';

import App from './App'

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  render(
    <App/>,
    document.getElementById('root')
  );
});
