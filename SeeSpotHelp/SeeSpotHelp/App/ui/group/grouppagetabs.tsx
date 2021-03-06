'use strict';

import * as React from 'react';
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
import OptimizedTab from '../shared/tabs/optimizedtab';

import GroupAnimalsTab from './groupanimalstab';
import AnimalsIcon from '../shared/animalsicon';
import ActivityTab from '../shared/tabs/activitytab';
import GroupMembersTab from './groupmemberstab';
import GroupScheduleTab from './groupscheduletab';

import Utils from '../uiutils';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';

export default class GroupPageTabs extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { groupDefaultTabKey: null };
    Utils.LoadOrSaveState(this.state);
  }

  componentWillMount() {
    if (this.props.group) {
      PermissionsStore.addPropertyListener(
        this, 'groupId', this.props.group.id, this.forceUpdate.bind(this));
    }
  }

  componentWillUnmount() {
    PermissionsStore.removePropertyListener(this);
  }

  handleTabSelect(key) {
    this.setState({groupDefaultTabKey : key});
    // We aren't supposed to manipulate state directly, but it doesn't yet have the newly
    // selected tab that we want to save to local storage.
    var stateDuplicate = this.state;
    stateDuplicate.groupDefaultTabKey = key;
    Utils.LoadOrSaveState(stateDuplicate);
  }

  getMembersTabTitle (group) {
    if (!group) return null;
    var permissions = PermissionsStore.getPermissionsByGroupId(group.id);
    if (permissions) {
      var count = 0;
      for (var i = 0; i < permissions.length; i++) {
        if (permissions[i].inGroup()) {
          count++;
        }
      }
      return Utils.getMembersGlyphicon(count);
    }
    return null;
  }

  render() {
    var defaultTabKey = this.state.groupDefaultTabKey ? this.state.groupDefaultTabKey : 1;
    return (
      <Tabs animation={false} className="tabs-area" activeKey={defaultTabKey}
          onSelect={this.handleTabSelect.bind(this)}>
        <OptimizedTab eventKey={1} title={Utils.getAnimalsTabIcon()} activeKey={defaultTabKey}>
          <GroupAnimalsTab group={this.props.group} permission={this.props.permission}/>
        </OptimizedTab>
        <OptimizedTab eventKey={2} title={this.getMembersTabTitle(this.props.group)} activeKey={defaultTabKey}>
          <GroupMembersTab group={this.props.group} permission={this.props.permission}/>
        </OptimizedTab>
        <OptimizedTab eventKey={3} title={Utils.getActivityGlyphicon()} activeKey={defaultTabKey}>
          <ActivityTab property='groupId' value={this.props.group.id} permission={this.props.permission}/>
        </OptimizedTab>
        <OptimizedTab eventKey={4} title={Utils.getCalendarGlyphicon()} activeKey={defaultTabKey}>
          <GroupScheduleTab group={this.props.group} view="group" permission={this.props.permission}/>
        </OptimizedTab>
      </Tabs>
    );
  }
}
