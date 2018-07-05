import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

const LoadingIndicator = ({size, thickness, color, style, label}) => (
    <div className="loading-indicator">
        <CircularProgress size={size} thickness={thickness} color={color} style={style}/>
        {label && <label className="loading-indicator__label">Loading...</label>}
    </div>
);

LoadingIndicator.propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.bool
};

export default LoadingIndicator;