import React from "react";
import * as path from 'path';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {remote} from 'electron';
import {openPm2Session, pm2RunAction} from './pm2service';

export class StartDialog extends React.Component {
    constructor(props) {
        super(props);
        this.startScript = this.startScript.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.readDirFromLocalStorage = this.readDirFromLocalStorage.bind(this);
        this.saveDir = this.saveDir.bind(this);
        this.handleDirChange = this.handleDirChange.bind(this);

        this.state = {file : '', startDisabled: true, dir : this.readDirFromLocalStorage()};

        openPm2Session();
    }

    readDirFromLocalStorage(){
        let dir = localStorage.getItem('pm2frontend:rootdir');
        if(dir) {
            return dir;
        }
        return 'c://Projects/iZerto/Server';
    }
    handleDirChange(event) {
        this.setState({
            dir: event.target.value,
        });
    }

    saveDir() {
        localStorage.setItem('pm2frontend:rootdir',this.state.dir);
    }


    openDialog(){
        const files = remote.dialog.showOpenDialog({properties: ['openFile']});
        this.setState({file: files[0], startDisabled: false});

    }

    startScript(){
        let fileObject = require(this.state.file);
        fileObject.cwd = path.join(this.state.dir ,fileObject.cwd);
        pm2RunAction('start', fileObject).catch((err) => {
            console.log(err);
        }).then(()=>{
            var window = remote.getCurrentWindow();
            window.close();
            });

    }

    render() {
        return (
            <div className="start">
                <TextField hintText="Select a Json file" value={this.state.file} floatingLabelText="Script to run" floatingLabelFixed={true} style={{width:'540px'}} />
                <FlatButton  label="..." onClick={this.openDialog} style={{fontWeight:'bold',width:'20px',minWidth:'40px'}}  />
                <TextField value={this.state.dir} onChange={this.handleDirChange} floatingLabelText="Root directory" floatingLabelFixed={true} style={{width:'540px'}} />
                <FlatButton  label="+" onClick={this.saveDir} style={{fontWeight:'bold',width:'20px',minWidth:'40px'}}  />
                <FlatButton disabled={this.state.startDisabled}  label="Start" onClick={this.startScript} style={{position:'absolute',bottom:20,right:10,fontWeight:'bold',width:'20px',minWidth:'80px'}}  />
            </div>
        );
    }
}

export default StartDialog;