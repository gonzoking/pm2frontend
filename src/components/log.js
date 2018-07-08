import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LogBlock from './LogBlock';

ReactDOM.render(
    <MuiThemeProvider>
        <Router history={hashHistory}>
            <Route path='/' component={LogBlock}/>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('rootlog')
);