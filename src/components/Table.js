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

const styles = {
    tableRow: {
        height: '15px'
    },

    tableRowRed:{
        color : 'red'
    },
    tableRowGreen:{
        color : 'green'
    }
};


/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class ProccessTable extends Component {

    constructor(props) {
        super(props);

        this.onRowSelection = this.onRowSelection.bind(this);
    }

    onRowSelection(rows){

        let selectedItems = [];
        if(rows==='all'){
            selectedItems = this.props.data.filter(item => item.id);
        }else if(rows==='none'){

        } else {
            rows.forEach(row => {
                selectedItems.push(this.props.data[row].id)
            });

        }
        this.props.selectedItemsFunc.call(this, selectedItems);
    }

    render() {
        return (
                <Table height="600px" selectable={true} multiSelectable={true} onRowSelection={this.onRowSelection}>
                    <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                        <TableRow>
                            <TableHeaderColumn tooltip="ID" width="50px">ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Name" width="260px">Name</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Status">Status</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Restart">Restarts</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Memory">Memory</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true}
                               stripedRows={true}>
                        {this.props.data.map((row, index) => (
                            <TableRow className="tableRow" key={index} style={styles.tableRow} >
                                <TableRowColumn style={styles.tableRow} width="50px">{index}</TableRowColumn>
                                <TableRowColumn style={styles.tableRow} width="260px">{row.name}</TableRowColumn>
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
