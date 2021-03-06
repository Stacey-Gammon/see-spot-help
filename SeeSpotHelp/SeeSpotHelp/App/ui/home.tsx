﻿'use strict';

require('autotrack');
import * as React from 'react';
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Loader = require('react-loader');

import ErrorPopup from './shared/errorpopup';
import MyNavBar from './navbar';
import DataServices from '../core/dataservices';

import GroupHomePage from './group/grouphomepage';
import ProfilePage from './person/profilepage';
import EditProfile from './person/editprofile';
import AddNewGroup from './group/addnewgroup';
import AddAnimalNote from './animal/addanimalnote';
import AnimalHomePage from './animal/animalHomePage';
import AddAnimalPage from './animal/addanimalpage';
import SignUpPage from './auth/signuppage';

import AddPhotoPage from './addphotopage';
var SearchPage = require('./searchpage');
import MemberPage from './person/memberpage';
import LoginPage from './auth/loginpage';
var PrivateBetaPage = require('./privatebetapage');
var EnterBetaCode = require('./enterbetacode');
import AddCalendarEvent from './addcalendarevent';
var UserSettingsPage = require('./person/usersettingspage');

import LoginStore from '../stores/loginstore';

// Comment out for debugging logs.
//console.log = function() {}

export default class Home extends React.Component<any, any> {
  public props: any;
  public context: any;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
    this.onLoginChange = this.onLoginChange.bind(this);
  }

  componentWillMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '1021154377958416',
        xfbml: true,
        version: 'v2.5'
      });
      LoginStore.fbLoaded = true;
    }.bind(this);

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1021154377958416';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  onLoginChange() {
    this.setState({error: false, errorMessage: null, loaded: true});
    if (((!LoginStore.getUser() && !LoginStore.userDownloading) ||
         (LoginStore.getUser() && !LoginStore.getUser().inBeta)) &&
        this.props.location.pathname != '/privatebetapage' &&
        this.props.location.pathname != '/loginpage' &&
        this.props.location.pathname != '/signuppage' &&
        this.props.location.pathname != '/enterBetaCode') {
      this.context.router.push('/loginpage');
    }
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onLoginChange);
    LoginStore.ensureUser().then(
      () => { this.setState({error: false, errorMessage: null}); },
      (error) => { this.setState({error: true, errorMessage: error}); }
    )
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onLoginChange);
  }

  render() {
    return (
        <div>
          <Loader loaded={this.state.loaded}>
            <ErrorPopup error={this.state.error} errorMessage={this.state.errorMessage}/>
            <MyNavBar/>
            {this.props.children}
          </Loader>
        </div>
      );
    }
}

var routes = (
  <Router path='/' component={Home}>
      <IndexRoute component={ProfilePage} />
      <Route path='searchPage' component={SearchPage}/>
      <Route path='groupHomePage' component={GroupHomePage}/>
      <Route path='animalHomePage' component={AnimalHomePage} />
      <Route path='addNewGroup' component={AddNewGroup} />
      <Route path='addAnimalPage' component={AddAnimalPage} />
      <Route path='profilePage' component={ProfilePage} />
      <Route path='memberPage' component={MemberPage} />
      <Route path='privateBetaPage' component={PrivateBetaPage} />
      <Route path='loginPage' component={LoginPage} />
      <Route path='addAnimalNote' component={AddAnimalNote} />
      <Route path='userSettingsPage' component={UserSettingsPage} />
      <Route path='addCalendarEvent' component={AddCalendarEvent} />
      <Route path='enterBetaCode' component={EnterBetaCode} />
      <Route path='addPhotoPage' component={AddPhotoPage} />
      <Route path='editProfile' component={EditProfile} />
      <Route path='signUpPage' component={SignUpPage} />
  </Router>
);

ReactDOM.render(
  <Router history={hashHistory} routes={routes}/>,
  document.getElementById('content')
);
