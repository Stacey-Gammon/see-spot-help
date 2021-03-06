﻿'use strict'

import * as React from 'react';

import EditorElement from '../shared/editor/editorelement';

import AnimalEditor from '../../core/editor/animaleditor';
import Animal from '../../core/databaseobjects/animal';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

import Utils from '../uiutils';

export default class AddAnimalPage extends React.Component<any, any> {
  public context: any;
  public refs: any;

  constructor(props, context) {
    super(props);
    this.onChange = this.onChange.bind(this);
    var mode = Utils.FindPassedInProperty(this, 'mode');
    var group = Utils.FindPassedInProperty(this, 'group');
    var groupId = Utils.FindPassedInProperty(this, 'groupId');
    var animal = Utils.FindPassedInProperty(this, 'animal');

    if (!mode) mode = 'add';

    if (!group && !groupId) {
      context.router.push('/profilePage');
    }

    this.state = {
      errorMessage: null,
      groupId: groupId || (group && group.id),
      mode: mode,
      animal: animal
    };

    Utils.LoadOrSaveState(this.state);
  }

  ensureRequiredState() {
    var promises = [];
    promises.push(GroupStore.ensureItemById(this.state.groupId));
    if (this.state.mode == 'edit') {
      promises.push(AnimalStore.ensureItemById(this.state.animal.id));
    }

    Promise.all(promises).then(
      function () {
        var group = GroupStore.getGroupById(this.state.groupId);
        var animal = this.state.mode == 'edit' ? AnimalStore.getItemById(this.state.animal.id) : null;
        var permission = StoreStateHelper.GetPermission(this.state);
        var editor = new AnimalEditor(animal);
        if (group) {
          this.setState({
            permission: permission,
            editor: editor
          });
          this.addChangeListeners(group);
        }
      }.bind(this)
    );
  }

  addChangeListeners() {
    LoginStore.addChangeListener(this.onChange);
    if (LoginStore.getUser()) {
      PermissionsStore.addPropertyListener(
        this, 'userId', LoginStore.getUser().id, this.onChange);
    }
  }

  componentWillMount() {
    if (!this.state.groupId) return;
    this.ensureRequiredState();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
    PermissionsStore.removePropertyListener(this);
  }

  onChange() {
    var group = this.state.group ? GroupStore.getGroupById(this.state.groupId) : null;
    var permission = StoreStateHelper.GetPermission(this.state);
    this.setState({ permission: permission });
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  goToAnimalPage() {
    var animalId =  this.state.editor.databaseObject.id;
    var groupId =  this.state.editor.databaseObject.groupId;
    this.context.router.push(
      { pathname: "animalHomePage", state: { animalId: animalId, groupId: groupId  } });
  }

  goToGroupPage() {
    var groupId =  this.state.editor.databaseObject.groupId;
    this.context.router.push(
      { pathname: "groupHomePage", state: { groupId: groupId } });
  }

  render() {
    if (!this.state.editor || !this.state.groupId) return null;
    var extraFields = {
      groupId: this.state.groupId,
      userId: LoginStore.getUser().id
    }
    Object.assign(extraFields, GroupStore.getGroupById(this.state.groupId));

    var title = this.state.mode == 'add' ?
      'Add an animal' : 'Edit ' + this.state.editor.databaseObject.name;
    return (
      <EditorElement
        title={title}
        extraFields={extraFields}
        mode={this.state.mode}
        permission={this.state.permission}
        onEditOrInsert={this.goToAnimalPage.bind(this)}
        onDelete={this.goToGroupPage.bind(this)}
        editor={this.state.editor} />
    );
  }
}
