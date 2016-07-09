import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import GroupHomePage from '../../ui/group/grouphomepage';
import ProfilePage from '../../ui/person/profilepage';
import EditProfile from '../../ui/person/editprofile';
import AddNewGroup from '../../ui/group/addnewgroup';
import AddAnimalNote from '../../ui/animal/addanimalnote';
import AnimalHomePage from '../../ui/animal/animalHomePage';
import AddAnimalPage from '../../ui/animal/addanimalpage';
import SignUpPage from '../../ui/auth/signuppage';

import AddPhotoPage from '../../ui/addphotopage';
var SearchPage = require('../../ui/searchpage');
import MemberPage from '../../ui/person/memberpage';
import LoginPage from '../../ui/auth/loginpage';
var PrivateBetaPage = require('../../ui/privatebetapage');
var EnterBetaCode = require('../../ui/enterbetacode');
import AddCalendarEvent from '../../ui/addcalendarevent';

import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';

var d3 = require("d3");

describe("InvalidPageLoads", function () {
  it("AnimalHomePage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(AnimalHomePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddAnimalPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddAnimalPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("GroupHomePage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(GroupHomePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddNewGroup", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddNewGroup);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("ProfilePage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(ProfilePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("EditProfile", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(EditProfile);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("SignUpPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(SignUpPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddPhotoPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddPhotoPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("SearchPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(SearchPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("MemberPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(MemberPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("LoginPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(LoginPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("PrivateBetaPage", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(PrivateBetaPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("EnterBetaCode", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(EnterBetaCode);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddCalendarEvent", function () {
    LoginStore.logout();
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddCalendarEvent);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });
});
