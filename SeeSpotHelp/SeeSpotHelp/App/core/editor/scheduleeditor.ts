
import Schedule from '../databaseobjects/schedule';

import InputTextAreaField from './inputfields/inputtextareafield';
import GroupSelectField from './inputfields/groupselectfield';
import AnimalSelectField from './inputfields/animalselectfield';
import InputField from './inputfields/inputfield';
import { InputFieldType } from './inputfields/inputfield';
import InputListField from './inputfields/inputlistfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import LoginStore from '../../stores/loginstore';

export default class SchedulEditor extends Editor {
  public databaseObject: Schedule;

  constructor(activity) {
    super(activity);
  }

  getInputFields() { return this.inputFields; }

  insert(extraFields) {
    var schedule = new Schedule()
    schedule.updateFromInputFields(this.inputFields);
    schedule.userId = LoginStore.getUser().id;
    var promise = schedule.insert();
    this.databaseObject = schedule;
    return promise;
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    return this.databaseObject.update();
  }

  getShowMemberField() {
    return this.databaseObject && LoginStore.getUser().id != this.databaseObject.userId;
  }

  createMemberInputField() {
    var inputField = new InputField([], InputFieldType.TEXT);
    inputField.disabled = true;
    return inputField;
  }

  createInputFields() {
    this.inputFields = {
      'member': this.createMemberInputField(),
      'groupId': this.createGroupSelectField(),
      'animalId': this.createAnimalSelectField(),
      'date': new InputField([InputFieldValidation.validateNotEmpty], InputFieldType.DATE),
      'startTime': new InputField([], InputFieldType.TIME),
      'endTime': new InputField([], InputFieldType.TIME),
      'description': new InputTextAreaField([])
    };

    if (this.getShowMemberField()) {
      for (var prop in this.inputFields) {
        this.inputFields[prop].disabled = true;
      }
    }
  }

  createGroupSelectField() {
    var inputField = new GroupSelectField([InputFieldValidation.validateNotEmpty]);
    inputField.addChangeListener(this.fillAnimalDropDown.bind(this));
    if (this.databaseObject) {
      inputField.setValue(this.databaseObject.groupId);
    }
    return inputField;
  }

  createAnimalSelectField() {
    var inputField = new AnimalSelectField([InputFieldValidation.validateNotEmpty]);
    if (this.databaseObject) {
      inputField.value = this.databaseObject.animalId;
    }
    return inputField;
  }

  fillAnimalDropDown() {
    this.inputFields['animalId'].populate(this.inputFields['groupId'].value);
  }

  validateFields() : boolean {
    this.errorMessage = null;
    var errorFound = !super.validateFields();
    var startTimeInputField = this.inputFields['startTime'];
    var endTimeInputField = this.inputFields['endTime'];

    if ((endTimeInputField.value && !startTimeInputField.value) ||
        (!endTimeInputField.value && startTimeInputField.value)) {
      this.errorMessage = 'Please enter both start and end time, or clear both.';
    }

    if (endTimeInputField.value && startTimeInputField.value) {
      var date = moment(this.inputFields['date'].value);
      var startDate =
          moment(date.format('MM-DD-YYYY') + ' ' + startTimeInputField.value, 'MM-DD-YYYY hh:mm a');
      var endDate =
          moment(date.format('MM-DD-YYYY') + ' ' + endTimeInputField.value, 'MM-DD-YYYY hh:mm a');

      if (!startDate.isBefore(endDate)) {
        this.errorMessage = 'Start time must be before end time.';
      }
    }
    return !errorFound && !this.errorMessage;
  }
}
