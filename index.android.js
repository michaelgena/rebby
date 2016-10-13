'use strict';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Root from './src/Root';

class Rebby extends Component {
  render() {
    return (
      <Root />
    );
  }
}

AppRegistry.registerComponent('Rebby', () => Rebby);
