'use strict'

import * as React from 'react';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import AnimalHeadShot from './animalheadshot';

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
export default class AnimalListItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  getAgeDisplay() {
    if (!this.props.animal.age) return null;
    return <div className='animalThumbnailText'>Age: {this.props.animal.age}</div>
  }
  render() {
    return (
      <a href='#' key={this.props.animal.id} className='list-group-item animalListElement'>
        <LinkContainer to={{ pathname: 'animalHomePage' ,
                 state: { user: this.props.user, group: this.props.group, animal: this.props.animal} }}>
          <div className='media'>
            <div className='media-left'>
              <AnimalHeadShot
                permission={this.props.permission}
                animal={this.props.animal}
                group={this.props.group}/>
            </div>
            <div className='media-body'>
              <div className='media-left animal-thumbnail-info-left'>
                <h4>{this.props.animal.name}</h4>
                <div className='animalThumbnailText'>{this.props.animal.status}</div>
                <div className='animalThumbnailText'>{this.props.animal.breed}</div>
                {this.getAgeDisplay()}
              </div>
              <div className='media-body'>
                <div className='list-item-description'>
                  {this.props.animal.description}
                </div>
              </div>
            </div>
          </div>
        </LinkContainer>
      </a>
    );
  }
}
