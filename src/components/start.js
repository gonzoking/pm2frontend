import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StartDialog from './StartDialog';

ReactDOM.render(
    <MuiThemeProvider>
        <Router history={hashHistory}>
            <Route path='/' component={StartDialog}/>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('rootstart')
);