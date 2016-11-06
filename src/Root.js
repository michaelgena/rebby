'use strict';
import React, { Component } from 'react';
import { View, NavigatorIOS, TabBarIOS, ToolbarAndroid, StyleSheet, Navigator, Platform, AsyncStorage } from 'react-native';

import RebList from './components/app/RebList';
import NewReb from './components/app/NewReb';
import Reb from './components/app/Reb';
import Icon from 'react-native-vector-icons/Ionicons';
import RealtimeRCT from './components/app/RealtimeRCT';
import RealtimeRCTAndroid from './components/app/RealtimeRCTAndroid';
import ChatList from './components/app/ChatList';
import Contacts from './components/app/Contacts';
import Settings from './components/app/Settings';

class Root extends Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Chats',
      isOnBoarding: true,
      nbNewMessages: 0
    };

    AsyncStorage.getItem("nbNewMessages").then((nbNewMessages) => {
      if(nbNewMessages != null){
        this.setState({
          nbNewMessages: nbNewMessages
        });
      }
    }).done();
  }

  addOneToBadge(){
    AsyncStorage.getItem("nbNewMessages").then((nbNewMessages) => {
      console.log("Nb New Messages ["+nbNewMessages+"]");
      if(nbNewMessages != null){
        this.setState({
          nbNewMessages: parseInt(nbNewMessages)+1
        });
      }else{
        this.setState({
          nbNewMessages: 1
        });
      }
      AsyncStorage.setItem("nbNewMessages", this.state.nbNewMessages.toString());
    }).done();
  }

  removeOneToBadge(){
    AsyncStorage.getItem("nbNewMessages").then((nbNewMessages) => {
      if(nbNewMessages != null && nbNewMessages > 0){
        this.setState({
          nbNewMessages: parseInt(nbNewMessages)-1
        });
      }else{
        this.setState({
          nbNewMessages: 0
        });
      }
      AsyncStorage.setItem("nbNewMessages", this.state.nbNewMessages.toString());
    }).done();
  }

  resetBadge(){
    this.setState({
        nbNewMessages: 0
    });
    AsyncStorage.setItem("nbNewMessages", this.state.nbNewMessages.toString());
  }

  componentDidMount() {

    AsyncStorage.getItem("isOnBoarding").then((value) => {
      console.log("AsyncStorage:"+value);
      if(value !== null && value === "false"){
        this.state.isOnBoarding = false;
      }
    }).done();
  }
  _renderContent() {
    if(this.state.selectedTab === 'Chats'){
      return (
        <NavigatorIOS
          ref="navChat"
          style={styles.container}
          initialRoute={{
            title: 'Chats',
            component: ChatList,
            passProps: {addOneToBadge: ()=>this.addOneToBadge(), removeOneToBadge: ()=>this.removeOneToBadge(), resetBadge: ()=>this.resetBadge()}
          }}
          itemWrapperStyle={styles.itemWrapper}
        />
      );
    }
    if(this.state.selectedTab === 'Contacts'){
      return (
        <NavigatorIOS
          ref="navContact"
          style={styles.container}
          initialRoute={{
            title: 'Contacts',
            component: Contacts,
            passProps: {addOneToBadge: ()=>this.addOneToBadge(), removeOneToBadge: ()=>this.removeOneToBadge(), resetBadge: ()=>this.resetBadge()}
          }}
          itemWrapperStyle={styles.itemWrapper}
        />

      );
    }

    return (
      <NavigatorIOS
        ref="navSettings"
        style={styles.container}
        initialRoute={{
          title: 'Settings',
          component: Settings,
          passProps: {addOneToBadge: ()=>this.addOneToBadge(), removeOneToBadge: ()=>this.removeOneToBadge(), resetBadge: ()=>this.resetBadge()}
        }}
        itemWrapperStyle={styles.itemWrapper}
      />
    );
  }

  render() {
    if (Platform.OS === 'android'){
      return (

        <Navigator
          style={styles.container}
          initialRoute={{id: 'chatList'}}
          renderScene={this.navigatorRenderScene}/>
      );
    }else{
      return (
        <TabBarIOS>
          <TabBarIOS.Item
          title="Contacts"
          systemIcon="contacts"
          selected={this.state.selectedTab === 'Contacts'}
          onPress={() => {
            this.setState({
              selectedTab: 'Contacts',
            });
          }}>
          {this._renderContent()}
          </TabBarIOS.Item>
          <Icon.TabBarItemIOS
          title="Chats"
          selected={this.state.selectedTab === 'Chats'}
          iconName="ios-chatbubbles-outline"
          iconSize={28}
          selectedIconColor="blue"
          badge={this.state.nbNewMessages > 0 ? this.state.nbNewMessages : undefined}
          onPress={() => {
            this.setState({
              selectedTab: 'Chats',
            });
          }}>
          {this._renderContent()}

          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
          title="Rebs"
          selected={this.state.selectedTab === 'Rebs'}
          iconName="ios-list-outline"
          iconSize={28}
          selectedIconColor="blue"
          onPress={() => {
            this.setState({
              selectedTab: 'Rebs',
            });
          }}>
            <NavigatorIOS
              ref="nav"
              style={styles.container}
              initialRoute={{
                title: 'Rebs',
                component: RebList,
                passProps: {addOneToBadge: ()=>this.addOneToBadge(), removeOneToBadge: ()=>this.removeOneToBadge(), resetBadge: ()=>this.resetBadge()},
                rightButtonTitle: "New",
                onRightButtonPress: () => {
                  this.refs.nav.navigator.push({
                    title: "New",
                    component: NewReb
                  });}
              }}
              itemWrapperStyle={styles.itemWrapper}
            />
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
          selected={this.state.selectedTab === 'Settings'}
          title="Settings"
          iconName="ios-settings-outline"
          iconSize={28}
          selectedIconColor="blue"
          onPress={() => {
            this.setState({
              selectedTab: 'Settings',
            });
          }}>
          {this._renderContent()}
          </Icon.TabBarItemIOS>
        </TabBarIOS>
      );
    }
  }

  navigatorRenderScene(route, navigator) {
    //_navigator = navigator;
    switch (route.id) {
      case 'rebList':
        return (<RebList navigator={navigator} title="Home"/>);
      case 'newReb':
        return (<NewReb navigator={navigator} title="New" {...route.passProps}/>);
      case 'reb':
        return (<Reb navigator={navigator} title="Reb" {...route.passProps}/>);
      case 'settings':
          return (<Settings navigator={navigator} title="Settings" {...route.passProps}/>);
      case 'chatList':
          return (<ChatList navigator={navigator} title="Chats" {...route.passProps}/>);
      case 'contacts':
          return (<Contacts navigator={navigator} title="Contacts" {...route.passProps}/>);
    }
  }

}
var styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#FFFFFF',
    },
    itemWrapper: {
      flex: 1,
    }
  });

module.exports = Root;
