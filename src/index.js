import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Main from './components/Main';

ReactDOM.render(
    <MuiThemeProvider>
        <Router history={hashHistory}>
            <Route path='/' component={Main}/>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
);
