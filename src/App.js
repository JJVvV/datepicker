
import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory'
import HashHistory from 'react-router/lib/HashHistory'
import Root from './js/containers/Root.js'
import { Redirect, Router, Route , Navigation} from 'react-router';
import RouterContainer from './js/services/routerContainer.js';

const history = new HashHistory();

var router = new Router({
  history:history
});

RouterContainer.set(router);

React.render(<Root history={history} />, document.getElementById('wrapper'));





