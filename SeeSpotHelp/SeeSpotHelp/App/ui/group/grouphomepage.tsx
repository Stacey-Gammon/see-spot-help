﻿'use strict';

import * as React from 'react';

var Intro = require('../intro');

import GroupInfoBar from './groupinfobar';
import GroupPageTabs from './grouppagetabs';

import Utils from '../../core/utils';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

export default class GroupHomePage extends React.Component<any, any> {
	constructor(props) {
		super(props);
		var groupId = Utils.FindPassedInProperty(this, 'groupId');
		this.state = { groupId: groupId };
		Utils.LoadOrSaveState(this.state);
	}

	componentWillMount() {
		this.loadFromServer();
	}

	componentWillUnmount() {
		StoreStateHelper.RemoveChangeListeners([LoginStore, GroupStore], this);
		PermissionsStore.removePropertyListener(this);
	}

	loadFromServer() {
		var groupId = this.state.groupId;
		// If the user doesn't have any 'last looked at' group, see if we can grab one from the user.
		if (!groupId && LoginStore.getUser()) {
			var groups = GroupStore.getGroupsByUser(LoginStore.getUser());
			if (groups && groups.length > 0) {
				groupId = groups[0].id;
			}
		}

		// User doesn't belong to any groups, and isn't looking at any.  We'll just show an intro
		// screen on the home page.
		if (!groupId) return;

		GroupStore.ensureItemById(groupId).then(
			function () {
				var group = GroupStore.getGroupById(groupId);
				var permission = StoreStateHelper.GetPermission(this.state);
				if (group) {
					Utils.SaveProp('groupId', group.id);
					this.setState({ permission: permission });
					this.addChangeListeners(group);
				}
			}.bind(this)
		);
	}

	loadDifferentGroup(group) {
		this.setState({ groupId: group.id });
	}

	addChangeListeners(group) {
		if (LoginStore.getUser()) {
			PermissionsStore.addPropertyListener(
				this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
		}
		StoreStateHelper.AddChangeListeners([LoginStore, GroupStore], this);
	}

	onChange() {
		var permission = StoreStateHelper.GetPermission(this.state);
		this.setState({ permission: permission });
	}

	hasGroupHomePage(group) {
		var permission = StoreStateHelper.GetPermission(this.state);
		return (
			<div className='page'>
				<GroupInfoBar group={group} permission={permission}/>
				<GroupPageTabs group={group} permission={permission} />
			</div>
		);
	}

	render() {
		console.log('GroupHomePage:render');
		if (this.state.groupId) {
			var group = GroupStore.getGroupById(this.state.groupId);
			if (group) {
				return this.hasGroupHomePage(group);
			}
		}
		return ( <div> <Intro /> </div> );
	}
}
