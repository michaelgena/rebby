'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

import loginInfo from '../utils/loginInfo';

class Splash extends Component {

  componentDidMount() {
    this._canLogIn().done();
  }

  async _canLogIn() {
    try {
      const canLogIn = await loginInfo.canLogin();
      if (canLogIn) {
        Actions.login();
      } else {
        Actions.login();
      }
    } catch (e) {
      throw e;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF058',
  }
});

export default Splash;
