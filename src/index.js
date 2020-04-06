import React from 'react';
import { render } from 'react-dom';
import { Switch, Route , BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import Home from './containers/Public/Home';
import 'antd/dist/antd.css';
import Campaign from './containers/Public/Campaign';
import Questions from './containers/Public/Questions';

render(
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/campaigns" component={Campaign} />
        <Route path="/questions" component={Questions} />
      </Switch>
    </Router>
  , document.getElementById('root'),
);

