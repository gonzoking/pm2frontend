import React from 'react';
import pm2 from 'pm2';
import LoadingIndicator from './LoadingIndicator';
import ProccessTable from './Table';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

const styles = {
    buttonStart: {
        position: 'absolute',
        top:'10px',
        right:'0px',
        color: '#26c2f0',
        width:'60px',
        fontWeight: 'bold'
    },
    buttonStop: {
        position: 'absolute',
        top:'10px',
        right:'80px',
        color: 'orange',
        fontWeight: 'bold'
    },
    buttonKill: {
        position: 'absolute',
        top:'10px',
        right:'160px',
        color: 'red',
        fontWeight: 'bold'
    }
    ,
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
        this.selectedChanged = this.selectedChanged.bind(this);

        this.selectedProccess = [];
        this.state = {proccessList: [], loading: true, showBlock: false};

        pm2.connect((err) => {
            if(err) {
                console.log('error connecting to pm2');
            }});
        pm2.disconnect();

        this.loadList();

        this.selectedItems = [];
        this.loadingFlag = true;
    }

    onKillProccess() {
        let counter = 0;
        if(this.selectedProccess.length > 0) {
            this.setState({showBlock: true});
            this.selectedProccess.forEach(item => {
                pm2.delete(item, (err) => {
                    if (err) {
                        console.log('failed to delete proccess ' + item);
                    }
                    counter++;
                    if (counter === this.selectedProccess.length) {
                        this.loadList();
                    }
                });
            });
        }
    }

    onRestartProccess() {
        let counter = 0;
        if(this.selectedProccess.length > 0) {
            this.setState({showBlock: true});
            this.selectedProccess.forEach(item => {
                pm2.restart(item, (err) => {
                    if (err) {
                        console.log('failed to restart proccess ' + item);
                    }
                    counter++;
                    if (counter === this.selectedProccess.length) {
                        this.loadList();
                    }
                });
            });
        }
    }

    onStopProccess() {
        let counter = 0;
        if(this.selectedProccess.length > 0) {
            this.setState({showBlock: true});
            this.selectedProccess.forEach(item => {
                pm2.stop(item, (err) => {
                    if (err) {
                        console.log('failed to stop proccess ' + item);
                    }
                    counter++;
                    if (counter === this.selectedProccess.length) {
                        this.loadList();
                    }
                });
            });
        }
    }

    loadList(){

        pm2.list((err, procceslist) => {
            //console.log('procceslist ='  +JSON.stringify(procceslist));
            const prList = procceslist.map((procces) => {
                return {
                    key: procces.pm_id, id: procces.pm_id, name: procces.name,pid: procces.pid,
                    status: procces.pm2_env.status, restart: procces.pm2_env.restart_time,
                    memory: procces.monit.memory,errlog:procces.pm2_env.pm_err_log_path,infolog:procces.pm2_env.pm_out_log_path
                }
            });
            this.setState({proccessList: prList, loading: false, showBlock: false});
        });
    }

    selectedChanged(selectedItems) {
        this.selectedProccess = selectedItems;
    }

    render() {
        return (
            <div className="main">
                {this.state.showBlock ? <div className="blockDiv">WORKING...</div> : ''}
                <p className="maintitle">PM2 - Proccess list</p>
                <FlatButton  label="RESTART" onClick={this.onRestartProccess} style={styles.buttonStart} />
                <FlatButton  label="STOP" onClick={this.onStopProccess} style={styles.buttonStop} />
                <FlatButton  label="KILL" onClick={this.onKillProccess} style={styles.buttonKill} />
                <IconButton  onClick={this.loadList} style={styles.buttonRefresh}><img src="images/refresh.png" width={35} height={35} /></IconButton>
                {this.state.loading === false ?
                    <div className="tableProcess">
                        <ProccessTable data={this.state.proccessList} selectedItemsFunc={this.selectedChanged}/>
                    </div>
                    :
                    <LoadingIndicator label={true}/>
                }
            </div>
        )
    }
}

export default Main;
