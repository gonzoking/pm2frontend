import React from "react";
import * as path from 'path';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {remote} from 'electron';
import {openPm2Session, pm2RunAction} from './pm2service';
import IconButton from 'material-ui/IconButton';

export class StartDialog extends React.Component {
    constructor(props) {
        super(props);
        this.startScript = this.startScript.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.readDirFromLocalStorage = this.readDirFromLocalStorage.bind(this);
        this.saveDir = this.saveDir.bind(this);
        this.handleDirChange = this.handleDirChange.bind(this);

        this.state = {showBlock: false, showerror: false, file : '', startDisabled: true, dir : this.readDirFromLocalStorage()};

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
        const files = remote.dialog.showOpenDialog({properties: ['openFile','multiSelections'],filters: [{name: 'Json', extensions: ['json']}]});
        this.setState({file: files[0], startDisabled: false});

    }

    startScript(){
        let fileObject = require(this.state.file);
        const dir = (path.parse(this.state.file).dir).replace('\\Exec','');

        fileObject.cwd = path.join(dir ,fileObject.cwd);

        this.setState({showBlock:true});
        pm2RunAction('start', fileObject).catch((err) => {
            console.log(err);
            this.setState({showerror: true});
            this.setState({showBlock:false});
        }).then(()=>{
            this.setState({showBlock:false});
            var window = remote.getCurrentWindow();
            window.close();
            });
    }

    render() {
        return (
            <div className="start">
                {this.state.showBlock ? <div className="blockDiv">WORKING...</div> : ''}
                <TextField hintText="Select a Json file" value={this.state.file} floatingLabelText="Script to run" floatingLabelFixed={true} style={{width:'540px'}} />
                <FlatButton  label="..." onClick={this.openDialog} style={{fontWeight:'bold',width:'20px',minWidth:'40px'}}  />
                {/*<TextField value={this.state.dir} onChange={this.handleDirChange} floatingLabelText="Root directory" floatingLabelFixed={true} style={{width:'540px'}} />
                <IconButton tooltip="Save in storage"  onClick={this.saveDir} style={{width:'25px'}}><img src="../images/disk.png" width={25} height={25} /></IconButton>*/}
                {this.state.showerror ? <div className="start__error">An error occurd while starting the service!</div> : ''}
                <FlatButton disabled={this.state.startDisabled}  label="Start" onClick={this.startScript} style={{position:'absolute',bottom:20,right:10,fontWeight:'bold',width:'20px',minWidth:'80px'}}  />
            </div>
        );
    }
}

export default StartDialog;