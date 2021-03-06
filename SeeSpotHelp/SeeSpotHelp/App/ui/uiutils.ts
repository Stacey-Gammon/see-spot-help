var React = require('react');

import Volunteer from '../core/databaseobjects/volunteer';
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Schedule from '../core/databaseobjects/schedule';
import Permission from '../core/databaseobjects/permission';
import Photo from '../core/databaseobjects/photo';
import Activity from '../core/databaseobjects/activity';

var SessionStorageClasses = {};
SessionStorageClasses['Volunteer'] = Volunteer;
SessionStorageClasses['Group'] = Group;
SessionStorageClasses['Animal'] = Animal;
SessionStorageClasses['Schedule'] = Schedule;
SessionStorageClasses['Permission'] = Permission;
SessionStorageClasses['Photo'] = Photo;

export enum AddOrEditMode {
  ADD,
  EDIT
};

export default class Utils {

  public static CopyInputFieldsIntoObject(inputFields, object) {
    for (var fieldName in inputFields) {
      object[fieldName] = inputFields[fieldName].value;
    }
  }

  // Unfortunately in React there are many ways to pass values from one component to another.
  // For example, transferring the user to another page via LinkContainer puts the state
  // variables in reactClass.props.location.state.  Passing a property along with html, e.g.
  // <MyComponent myproperty="value"/> is accessed via this.props.  I suppose we should Probably
  // keep track of each way the different pages and components are accessed and variables passed
  // along but this is easy for now to just check all ways.
  public static FindPassedInProperty(reactClass, property) {
    if (reactClass.props[property]) {
      return reactClass.props[property];
    } else if (reactClass.props.location &&
      reactClass.props.location.state &&
      reactClass.props.location.state[property]) {
      return reactClass.props.location.state[property];
    } else {
      return null;
    }
  }

  public static GenerateClass(className) {
    return SessionStorageClasses[className];
  };

  // Loops through properties on the state object. Any that are null or empty are attempted to be
  // retrieved from session storage. Any that aren't are stored in session storage.
  public static LoadOrSaveState(state) {
    for (var prop in state) {
      if (state[prop] === null) {
        Utils.LoadStateProp(state, prop);
      } else {
        Utils.SaveStateProp(state, prop);
      }
    }
  }

  public static SaveStateProp(state, prop) {
    this.SaveProp(prop, state[prop]);
  }

  public static SaveProp(prop, value) {
    sessionStorage.setItem(prop, JSON.stringify(value));
  }

  public static GetProp(prop) {
    return JSON.parse(sessionStorage.getItem(prop));
  }

  public static LoadStateProp(state, prop) {
    try {
      state[prop] = JSON.parse(sessionStorage.getItem(prop));
      if (state[prop] && state[prop].className) {
        var ClassName = Utils.GenerateClass(state[prop].className);
        var instance = new ClassName();
        state[prop] = Object.assign(instance, state[prop]);
      }
    } catch (error) {
      console.log("Failed to load property " + prop + " into state: ", error);
      sessionStorage.setItem(prop, null);
    }
  }

  public static getCalendarGlyphicon() {
    var title = screen.width < 600 ? '' : 'Calendar';
    var iconSize = screen.width < 600 ? '20px' : '15px';
    return React.createElement("div", null,
      React.createElement(
        "span", { className: "glyphicon glyphicon-calendar", style: {fontSize: iconSize}}
      ),
      '  ' + title
    );
  };

  public static getMembersGlyphicon(memberCount) {
    var title = screen.width < 600 ? '' : 'Members';
    var iconSize = screen.width < 600 ? '20px' : '15px';
    var secondIconSize = screen.width < 600 ? '15px' : '10px';

    return React.createElement("div", null,
      React.createElement(
        "span", { className: "glyphicon glyphicon-user", style: {fontSize: iconSize}}),
      React.createElement(
        "span", { className: "glyphicon glyphicon-user", style: {fontSize: secondIconSize, marginLeft: '-5px'}}),
      ' ' + title + ' (' + memberCount + ')'
    );
  }

  public static getAnimalsTabIcon() {
    var title = screen.width < 600 ? '' : 'Animals';
    var iconWidth = screen.width < 600 ? 35 : 25;
    var iconHeight = iconWidth - 11;
    return React.createElement("div", null,
      React.createElement(
        "img", { className: "glyphicon",
          src: "images/silhouettes.png",
          style: {width: iconWidth + 'px', height: iconHeight + 'px'}
        }
      ),
      '  ' + title
    );
  }

  public static getActivityGlyphicon() {
    var title = screen.width < 600 ? '' : 'Activity';
    var iconSize = screen.width < 600 ? '20px' : '15px';
    return React.createElement("div", null,
      React.createElement(
        "span", { className: "glyphicon glyphicon-list", style: {fontSize: iconSize}}
      ),
      '  ' + title
    );
  }

  public static getGroupGlyphicon() {
    var title = screen.width < 600 ? '' : 'Groups';
    var iconSize = screen.width < 600 ? '20px' : '15px';
    return React.createElement("div", null,
      React.createElement(
        "i", { className: "fa fa-object-group", style: {fontSize: iconSize}}
      ),
      '  ' + title
    );
  }

  public static getMessageGlyphicon() {
    var title = screen.width < 600 ? '' : 'Message';
    var iconSize = screen.width < 600 ? '20px' : '15px';
    return React.createElement("div", null,
      React.createElement(
        "span", { className: "glyphicon glyphicon-envelope", style: {fontSize: iconSize}}
      ),
      '  ' + title
    );
  }
}
