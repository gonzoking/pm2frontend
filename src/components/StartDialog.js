import React from "react";
import * as path from 'path';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {remote} from 'electron';
import {openPm2Session, pm2RunAction, pm2StartAction} from './pm2service';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export class StartDialog extends React.Component {
    constructor(props) {
        super(props);
        this.startScript = this.startScript.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.readDirFromLocalStorage = this.readDirFromLocalStorage.bind(this);
        this.saveDir = this.saveDir.bind(this);
        this.handleDirChange = this.handleDirChange.bind(this);
        this.clearFiles = this.clearFiles.bind(this);
        this.handleEnvChange = this.handleEnvChange.bind(this);

        this.state = {env: 'e2e', files: [],showBlock: false, showerror: false, startDisabled: true, dir : this.readDirFromLocalStorage()};

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

    clearFiles(){
        this.setState({files:[]});
    }

    handleEnvChange(event){
        this.setState({env:event.target.value});
    }
    openDialog(){
        const files = remote.dialog.showOpenDialog({properties: ['openFile','multiSelections'],filters: [{name: 'Json', extensions: ['json']}]});
        this.files = files;
        this.setState({files:files,startDisabled: false});

    }

    startScript(){
        this.state.files.forEach((file) => {
            let fileObject = require(file);
            const dir = (path.parse(file).dir).replace('\\Exec','');

            fileObject.cwd = path.join(dir ,fileObject.cwd);
            fileObject.env = fileObject['env_' + this.state.env];
            this.setState({showBlock:true});
            pm2StartAction(fileObject).catch((err) => {
                console.log(err);
                this.setState({showerror: true, showBlock:false});
            }).then(()=>{
                this.setState({showBlock:false});
                var window = remote.getCurrentWindow();
                window.close();
            });
        });

    }

    render() {
        return (
            <div className="start">
                {this.state.showBlock ? <div className="blockDiv">WORKING...</div> : ''}
                {/*<TextField hintText="Select a Json file" value={this.state.file} floatingLabelText="Script to run" floatingLabelFixed={true} style={{width:'540px'}} />*/}
                <FlatButton  label="Select Files" onClick={this.openDialog} style={{fontWeight:'bold',width:'140px',minWidth:'40px'}}  />
                <div style={{height:'100%',overflow:'auto'}}>
                <List >
                    {/*<Subheader>Selected script files</Subheader>*/}
                    {this.state.files.map(function(name,index){
                       return <ListItem innerDivStyle={{fontSize:'12px',padding:'2px',paddingBottom:'2px'}} primaryText={ name } key={index}></ListItem>;
                    })}
                </List>
                </div>
                <TextField value={this.state.env} onChange={this.handleEnvChange} floatingLabelText="Enviornment" floatingLabelFixed={true} style={{width:'540px'}} />
                {/*<IconButton tooltip="Save in storage"  onClick={this.saveDir} style={{width:'25px'}}><img src="../images/disk.png" width={25} height={25} /></IconButton>*/}
                {this.state.showerror ? <div className="start__error">An error occurd while starting the service!</div> : ''}
                <FlatButton disabled={this.state.startDisabled}  label="Start" onClick={this.startScript} style={{position:'absolute',bottom:20,right:10,fontWeight:'bold',width:'20px',minWidth:'80px'}}  />
                <FlatButton disabled={this.state.files.length===0}  label="Clear" onClick={this.clearFiles} style={{position:'absolute',bottom:20,right:120,fontWeight:'bold',width:'20px',minWidth:'80px'}}  />
            </div>
        );
    }
}

export default StartDialog;