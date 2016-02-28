﻿'use strict'

var React = require('react');

var GroupInfoBox = React.createClass({
    render: function () {
        console.log("GroupInfoBox:render");
        return (
            <div className="shelterInfoBox">
                <h1>{this.props.group.name}</h1>
                <h2>{this.props.group.shelter}</h2>
                <h2>{this.props.group.address}</h2>
                <h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
            </div>
        );
    }
});

module.exports = GroupInfoBox;
