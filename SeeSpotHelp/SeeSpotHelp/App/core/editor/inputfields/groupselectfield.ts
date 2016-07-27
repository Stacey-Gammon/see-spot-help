import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

import GroupStore from '../../../stores/groupstore';
import LoginStore from '../../../stores/loginstore';
import PermissionsStore from '../../../stores/permissionsstore';
import { Status } from '../../databaseobjects/databaseobject';

// Represents an input form field of the drop down list type.
export default class GroupSelectField extends InputField {
  public type: InputFieldType = InputFieldType.GROUP_SELECT;
  public options: Array<{value: any, name: string}> = [];
  public defaultListItemIndex: number = 0;
  public loading: boolean = true;
  public onLoad: any;

  constructor (validations?) {
    super(validations);
    this.populate = this.populate.bind(this);
    LoginStore.addChangeListener(this.populate);
  }

  getDefaultValue() {
    if (this.options.length) {
      return this.options[0].value;
    }
    return null;
  }

  populate() : Promise<any> {
    if (!LoginStore.getUser()) { return; }

    this.options = [];
    this.loading = false;

    return PermissionsStore.ensureItemsByProperty('userId', LoginStore.getUser().id)
        .then((permissions) => {
          let groupPromises = [];
          for (var i = 0; i < permissions.length; i++) {
            if (permissions[i].inGroup) {
              let groupId = permissions[i].groupId;
              groupPromises.push(GroupStore.ensureItemById(groupId));
            }
          }

          return Promise.all(groupPromises);
        })
        .then((results) => {
          for (let i = 0; i < results.length; i++) {
            let group = results[i];
            this.options.push({ name: group.name, value: group.id });
          }
          if (this.onLoad) { this.onLoad(); }
          this.loading = false;
        });
  }
}
