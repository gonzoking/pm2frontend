import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

import {remote} from 'electron';

const styles = {
    tableRow: {
        height: '15px'

    },

    tableRowRed:{
        color : 'red'
    },
    tableRowGreen:{
        color : 'green'
    },
    logButton:{
        width:20,
        zIndex:10000,
        marginLeft:0,
        paddingLeft: 0,
        paddingRight: 4
    }
};


/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class ProccessTable extends Component {

    constructor(props) {
        super(props);

        this.onRowSelection = this.onRowSelection.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.getStripedStyle = this.getStripedStyle.bind(this);
        this.selectedItems = [];
        this.windowsList = [];
        this.lastClickedColumn = undefined;
    }

    onRowSelection(rows){

        this.selectedItems = [];
        if(rows==='all'){
            this.selectedItems = this.props.data.map(item => item.id);
        }else if(rows==='none'){

        } else {
            rows.forEach(row => {
                this.selectedItems.push(this.props.data[row].id)
            });

        }
        this.props.selectedItemsFunc.call(this, this.selectedItems);
    }

    isSelected(id){
        return this.selectedItems.includes(id);
    }

    onCellClick(row,columnid){
        this.lastClickedColumn = columnid;
        if(columnid === 0 || columnid === 1){
            const BrowserWindow = remote.BrowserWindow;
            const windowId = columnid +  ':' + this.props.data[row].pid;
            if(this.windowsList.includes(windowId)){
                return;
            }
            var win = new BrowserWindow({ width: 800, height: 600 });
            win.windowId = windowId;
            this.windowsList.push(win.windowId);

            win.on('close', (e) =>{
                var index = this.windowsList.indexOf(win.windowId);
                if (index > -1) {
                    this.windowsList.splice(index, 1);
                }
            });

            //win.webContents.openDevTools();
            const logType = columnid === 0 ? 'info' : 'err';
            win.loadURL(`file://${__dirname}/log.html?name=${this.props.data[row].name}&errpath=${this.props.data[row].errlog}&infolog=${this.props.data[row].infolog}&logType=${logType}`);
        }
    }
    getStripedStyle(index) {
        return { background: index % 2 ? 'white' : '#f2f8ff' };
    }
    render() {
        return (
                <Table height="600px" selectable={true} multiSelectable={true} onRowSelection={this.onRowSelection} onCellClick={this.onCellClick}>
                    <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                        <TableRow>
                            <TableHeaderColumn tooltip="Log window" width="20px">LOG</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Log Error window" width="20px">ERR</TableHeaderColumn>
                            <TableHeaderColumn tooltip="ID" >ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Name" width="260px">Name</TableHeaderColumn>
                            <TableHeaderColumn tooltip="PID" >PID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Status">Status</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Restart">Restarts</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Memory">Memory</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true}
                               stripedRows={false}>
                        {this.props.data.map((row, index) => (
                            <TableRow key={index} style={this.getStripedStyle(index)} >
                                <TableRowColumn style={styles.tableRow} width="20px" >
                                    <IconButton tooltip="Info Log" style={styles.logButton}><img src="images/logBtn.png" width={20} height={30} />
                                    </IconButton>

                                </TableRowColumn>
                                <TableRowColumn style={styles.tableRow} width="20px">
                                    <IconButton tooltip="Error Log" style={styles.logButton}><img src="images/logErrBtn.png" width={20} height={30} />
                                    </IconButton>
                                </TableRowColumn>
                                <TableRowColumn style={styles.tableRow} >{index}</TableRowColumn>
                                <TableRowColumn style={styles.tableRow} width="260px"><b>{row.name}</b></TableRowColumn>
                                <TableRowColumn style={styles.tableRow} >{row.pid}</TableRowColumn>
                                <TableRowColumn style={row.status === 'online' ?styles.tableRowGreen : styles.tableRowRed}>{row.status}</TableRowColumn>
                                <TableRowColumn style={styles.tableRow}>{row.restart}</TableRowColumn>
                                <TableRowColumn style={styles.tableRow}>{row.memory}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        );
    }
}

ProccessTable.propTypes = {
    data: PropTypes.array.isRequired,
    selectedItemsFunc: PropTypes.func.isRequired
};
