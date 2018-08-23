import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class SortingHeader extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (<div id={this.props.headerId} onClick={this.props.clickHandler}>{this.props.label}<div className={'sort-arrow' + ' ' + this.props.className}></div></div>);
    }
}

SortingHeader.propTypes = {
    className: PropTypes.string.isRequired,
    label:PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    headerId: PropTypes.string.isRequired
};