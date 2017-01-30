import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './components/app'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}/>
    </Router>
  ), document.getElementById('app'));
});
