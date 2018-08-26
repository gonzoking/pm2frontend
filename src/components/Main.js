import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import ProccessTable from './Table';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {openPm2Session, pm2RunAction, pm2LoadList} from './pm2service';
import {remote} from 'electron';
import orderBy from 'lodash/orderBy';

const styles = {
    buttonReStart: {
        position: 'absolute',
        top:'6px',
        right:'0px',
        color: '#26c2f0',
        width:'60px',
        fontWeight: 'bold'
    },
    buttonStop: {
        position: 'absolute',
        top:'6px',
        right:'80px',
        color: 'black',
        fontWeight: 'bold'
    },
    buttonKill: {
        position: 'absolute',
        top:'6px',
        right:'160px',
        color: 'red',
        fontWeight: 'bold'
    },
    buttonStart:{
        position: 'absolute',
        top:'6px',
        right:'240px',
        color: 'black',
        fontWeight: 'bold'
    },
    buttonRefresh: {
        position: 'absolute',
        top:'-2px',
        left:'150px',
        color: 'blue'
    }

};

export class Main extends React.Component {
    constructor(props) {
        super(props);

        this.loadList = this.loadList.bind(this);
        this.onRestartProccess = this.onRestartProccess.bind(this);
        this.onStopProccess = this.onStopProccess.bind(this);
        this.onKillProccess = this.onKillProccess.bind(this);
        this.onStartProccess = this.onStartProccess.bind(this);
        this.selectedChanged = this.selectedChanged.bind(this);
        this.pm2RunAction = this.pm2RunAction.bind(this);
        this.refresh = this.refresh.bind(this);
        this.sortData = this.sortData.bind(this);
        //this.selectedProccess = [];
        this.state = {selectedProccess: [] ,proccessList: [], loading: true, showBlock: false, disableButton: true, sortField: undefined, sortDirection: undefined};
        openPm2Session();

        //setInterval(this.loadList, 10000);
        this.loadList();

        this.selectedItems = [];
        this.loadingFlag = true;
        //const BrowserWindow = remote.BrowserWindow;
        this.startWin = undefined;
        this.prList = [];
    }



    onStartProccess() {

        this.startWin = new remote.BrowserWindow({title: 'Start a script', width: 640, height: 360});
        this.startWin.loadURL(`file://${__dirname}/start.html`);

        //win.webContents.openDevTools();
        this.startWin.on('close', (e) =>{
            this.loadList();
        });
    }

    onKillProccess() {
        this.pm2RunAction('delete');
    }

    onRestartProccess() {
        this.pm2RunAction('restart');
    }

    onStopProccess() {
        this.pm2RunAction('stop');
    }

    pm2RunAction(action) {
        let counter = 0;
        if(this.state.selectedProccess.length > 0) {
            this.setState({showBlock: true});
            this.state.selectedProccess.forEach(item => {
                pm2RunAction(action, item).catch(err => {console.log(`failed to ${action} proccess `);}).then(() => {
                    counter++;
                    if (counter === this.state.selectedProccess.length) {
                        this.loadList();
                    }
                })
            });
        }
    }

    refresh() {
        this.setState({loading: true});
        this.loadList();
    }

    loadList(){
        pm2LoadList().then((procceslist) => {
            //console.log('procceslist ='  +JSON.stringify(procceslist));
            this.prList = procceslist.map((procces) => {
                return {
                    key: procces.pm_id, id: procces.pm_id, name: procces.name,pid: procces.pid,
                    status: procces.pm2_env.status, restart: procces.pm2_env.restart_time,
                    memory: procces.monit.memory,errlog:procces.pm2_env.pm_err_log_path,infolog:procces.pm2_env.pm_out_log_path
                }
            });
            if(this.state.sortField && this.state.sortDirection) {
                this.prList = orderBy(this.prList, [this.state.sortField], [this.state.sortDirection === 'desc' ? 'desc' : 'asc']);
            }
            this.setState({proccessList: this.prList, loading: false, showBlock: false});
        });
    }

    selectedChanged(selectedItems) {

        //this.selectedProccess = selectedItems;
        this.setState({selectedProccess: selectedItems, disableButton: selectedItems.length === 0});
    }

    sortData(sortField, direction ){

        if(sortField){
            this.prList = orderBy(this.prList, [sortField], [direction === 'desc' ? 'desc' : 'asc']);
            this.setState({proccessList: this.prList, sortField: sortField, sortDirection: direction});
        }
    }

    render() {
        return (
            <div className="main">
                {this.state.showBlock ? <div className="blockDiv">WORKING...</div> : ''}
                <p className="maintitle">PM2 - Proccess list</p>
                <FlatButton  label="RESTART" className={this.state.disableButton ? 'disable-button' : ''} disabled={this.state.disableButton} onClick={this.onRestartProccess} style={styles.buttonReStart} />
                <FlatButton  label="STOP" className={this.state.disableButton ? 'disable-button' : ''} disabled={this.state.disableButton} onClick={this.onStopProccess} style={styles.buttonStop} />
                <FlatButton  label="KILL" className={this.state.disableButton ? 'disable-button' : ''} disabled={this.state.disableButton} onClick={this.onKillProccess} style={styles.buttonKill} />
                <FlatButton  label="START" className={this.state.disableButton ? 'disable-button' : ''} disabled={this.state.disableButton} onClick={this.onStartProccess} style={styles.buttonStart} />
                <IconButton tooltip="Refresh"  onClick={this.refresh} style={styles.buttonRefresh}><img src="images/refreshBtn.png" width={30} height={30} /></IconButton>
                {this.state.loading === false ?
                    <div className="tableProcess">
                        <ProccessTable data={this.state.proccessList} selectedRows={this.state.selectedProccess} selectedItemsFunc={this.selectedChanged} sortFunction={this.sortData}/>
                    </div>
                    :
                    <LoadingIndicator label={true}/>
                }
            </div>
        )
    }
}

export default Main;
