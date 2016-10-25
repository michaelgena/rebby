'use strict';
import React, { Component } from 'react';
import { View, Text, Navigator, Platform, AsyncStorage} from 'react-native';
import realtimeIOS from '../../../RCTRealtimeMessagingIOS';
import realtimeAndroid from '../../../RCTRealtimeMessagingAndroid';
var RCTRealtimeMessaging;
if (Platform.OS === 'ios'){
  RCTRealtimeMessaging = new realtimeIOS();
}
if (Platform.OS === 'android'){
  RCTRealtimeMessaging = new realtimeAndroid();
}
var userToken = "";
var conf = require("../../data/conf.js");

var NotificationHandler = React.createClass({
  doConnect() {
    RCTRealtimeMessaging.RTEventListener("onConnected",this._onConnected),
    //RCTRealtimeMessaging.RTEventListener("onDisconnected",this._onDisconnected),
    RCTRealtimeMessaging.RTEventListener("onSubscribed",this._onSubscribed),
    //RCTRealtimeMessaging.RTEventListener("onUnSubscribed",this._onUnSubscribed),
    RCTRealtimeMessaging.RTEventListener("onException",this._onException),
    RCTRealtimeMessaging.RTEventListener("onMessage",this._onMessage);
    //RCTRealtimeMessaging.RTEventListener("onPresence",this._onPresence);

    AsyncStorage.getItem("userInfo").then((result) => {
      if(result != null){
        result = result.replace(/\|/g , ",");
        result = result.replace(/\\"/g , "\"");
        var userInfoAsJSON = JSON.parse(result);
        userToken = userInfoAsJSON.token;
        RCTRealtimeMessaging.RTConnect(
        {
          channel: userToken,
          appKey: conf.get().appKey,
          token: conf.get().token,
          connectionMetadata: conf.get().connectionMetadata,
          clusterUrl: conf.get().clusterUrl,
          projectId: conf.get().projectId,
        });
      }
    }).done();
  },

  componentWillUnmount() {
    RCTRealtimeMessaging.RTDisconnect();
  },

  _onConnected(){
    console.log('Connected!');
    console.log('Trying to subscribe...');
    RCTRealtimeMessaging.RTSubscribeWithNotifications(userToken, true);
  },

  _onSubscribed(subscribedEvent){
    console.log('Subscribed!');
  },

  _onException(exceptionEvent){
    //this._log("Exception:" + exceptionEvent.error);
    console.log("Exception:" + exceptionEvent.error);
  },

  /*doSendMessage(message){
    RCTRealtimeMessaging.RTSendMessage(message, this.state.channel);
  }*/

  _onMessage(messageEvent){
    console.log("received notification message: ["+messageEvent.message+"] on channel [" + messageEvent.channel+"]");
  },

  render(){
    return;
  }
});
module.exports = NotificationHandler;
