'use strict'

import * as React from 'react';

import Utils from '../uiutils';
import Animal from '../../core/databaseobjects/animal';
import Group from '../../core/databaseobjects/group';
import Permission from '../../core/databaseobjects/permission';
import AnimalStore from '../../stores/animalstore';
import PhotoStore from '../../stores/photostore';
import GroupStore from '../../stores/groupstore';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

import AnimalPageTabs from './animalpagetabs';
import AnimalInfoBar from './animalinfobar';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
export default class AnimalHomePage extends React.Component<any, any> {
  public context: any;
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    var animal = Utils.FindPassedInProperty(this, 'animal');
    var animalId = Utils.FindPassedInProperty(this, 'animalId');
    var group = Utils.FindPassedInProperty(this, 'group');
    var groupId = Utils.FindPassedInProperty(this, 'groupId');

    if ((!group && !groupId) || (!animal && !animalId)) {
      context.router.push('/profilePage');
    }

    this.state = {
      animalId: animalId || (animal && animal.id),
      groupId: groupId || (group && group.id),
      permission: Permission.CreateNonMemberPermission(),
      animalDefaultTabKey: null
    };

    Utils.LoadOrSaveState(this.state);
    this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    LoginStore.addChangeListener(this.onUserLoggedIn);
    if (!this.state.groupId || !this.state.animalId || !LoginStore.getUser()) return;
    this.onUserLoggedIn();
  }

  onUserLoggedIn() {
    if (LoginStore.getUser()) {
      var idToStoreMap = {};
      idToStoreMap[this.state.groupId] = GroupStore;
      idToStoreMap[this.state.animalId] = AnimalStore;
      StoreStateHelper.EnsureRequiredState(idToStoreMap, this);
    }
  }

  componentDidMount() {
    PhotoStore.addPropertyListener(
      this, 'animalId', this.state.animalId, this.onChange.bind(this));
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
    PhotoStore.removePropertyListener(this);
    PermissionsStore.removePropertyListener(this);
    GroupStore.removePropertyListener(this);
    AnimalStore.removePropertyListener(this);
  }

  onChange() {
    var permission = StoreStateHelper.GetPermission(this.state);
    this.setState({ permission: permission });
  }

  render() {
    if (!this.state.groupId || !this.state.animalId) return null;

    var animal = AnimalStore.getItemById(this.state.animalId);
    var group = GroupStore.getItemById(this.state.groupId);
    if (!animal || !group) return null;
    return (
      <div className="page">
        <AnimalInfoBar
          group={group}
          permission={this.state.permission}
          animal={animal} />
        <AnimalPageTabs
          group={group}
          permission={this.state.permission}
          animal={animal} />
      </div>
    );
  }
}
