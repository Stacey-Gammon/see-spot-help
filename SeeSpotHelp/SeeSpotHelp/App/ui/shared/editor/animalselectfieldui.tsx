import * as React from 'react';
var Loader = require('react-loader');

import InputField from '../../../core/editor/inputfields/inputfield';
import AnimalSelectField from '../../../core/editor/inputfields/animalselectfield';
import { InputFieldType } from '../../../core/editor/inputfields/inputfield';

export interface AnimalSelectFieldPropTypes {
  inputField : AnimalSelectField,
  groupId?: string
}

export default class AnimalSelectFieldUI extends React.Component<AnimalSelectFieldPropTypes, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  getValue() {
    var element = this.refs[this.props.inputField.ref];
    return element ? element['value'] :
        this.props.inputField.value || this.props.inputField.getDefaultValue();
  }

  componentDidMount() {
    this.props.inputField.onLoad = this.onChange.bind(this);
    this.props.inputField.onChange = this.onChange.bind(this);
    if (this.props.groupId) {
      this.setState({loaded: false});
      this.props.inputField.populate(this.props.groupId).then(() => {
        this.setState({ loaded: true });
      });
    } else {
      // No group, empty options, mark loaded.
      this.setState({loaded: true});
    }
  }

  onChange() {
    this.props.inputField.value = this.getValue();
  }

  createTypeOption(option) {
    return <option value={option.value}>{option.name}</option>
  }

  getInputListElement(inputField: AnimalSelectField) {
    if (!this.state.loaded) {
      return <Loader loaded={this.state.loaded}/>
    }

    var inputFieldClassName = 'form-control ' + inputField.ref;
    var options = inputField.options.map(this.createTypeOption);
    var defaultValue = inputField.value ? inputField.value : inputField.getDefaultValue();
    return (
      <select defaultValue={defaultValue}
              className={inputFieldClassName}
              disabled={inputField.disabled}
              id={inputField.ref}
              ref={inputField.ref}>
        {options}
      </select>);
  }

  render() {
    return this.getInputListElement(this.props.inputField);
  }
}
