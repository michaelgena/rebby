'use strict';
import React, { Component } from 'react';
import { AppRegistry, View, Text, Navigator, Platform, AsyncStorage} from 'react-native';
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

Array.prototype.indexOf || (Array.prototype.indexOf = function(d, e) {
    var a;
    if (null == this) throw new TypeError('"this" is null or not defined');
    var c = Object(this),
        b = c.length >>> 0;
    if (0 === b) return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b) return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d) return a;
        a++
    }
    return -1
});

class NotificationHandler extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("Loading Notification Handler...");
    this.doConnect();
  }

  doConnect() {
    RCTRealtimeMessaging.RTEventListener("onConnected",this._onConnected),
    //RCTRealtimeMessaging.RTEventListener("onDisconnected",this._onDisconnected),
    RCTRealtimeMessaging.RTEventListener("onSubscribed",this._onSubscribed),
    //RCTRealtimeMessaging.RTEventListener("onUnSubscribed",this._onUnSubscribed),
    RCTRealtimeMessaging.RTEventListener("onException",this._onException),
    RCTRealtimeMessaging.RTEventListener("onMessage",this._onMessage.bind(this));
    //RCTRealtimeMessaging.RTEventListener("onPresence",this._onPresence);
    //RCTRealtimeMessaging.RTEventListener("onPushNotification", this._onNotification);
    RCTRealtimeMessaging.RTPushNotificationListener(this._onNotification.bind(this));

    AsyncStorage.getItem("userInfo").then((result) => {
      if(result != null){
        result = result.replace(/\|/g , ",");
        result = result.replace(/\\"/g , "\"");
        var userInfoAsJSON = JSON.parse(result);
        userToken = userInfoAsJSON.token;
        //this.getMessages();
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
  }

  componentWillUnmount() {
    RCTRealtimeMessaging.RTDisconnect();
  }

  _onConnected(){
    console.log('Connected!');
    console.log('Trying to subscribe...');
    RCTRealtimeMessaging.RTSubscribeWithNotifications(userToken, true);

    //Global channel
    RCTRealtimeMessaging.RTSubscribeWithNotifications("all", true);
    //RCTRealtimeMessaging.RTSubscribe(userToken, true);
    //console.log('Subscribed on Channel '+userToken);
  }

  _onSubscribed(subscribedEvent){
    console.log('Subscribed!');
  }

  _onException(exceptionEvent){
    //this._log("Exception:" + exceptionEvent.error);
    console.log("Exception:" + exceptionEvent.error);
  }

  /*doSendMessage(message){
    RCTRealtimeMessaging.RTSendMessage(message, this.state.channel);
  }*/
  asyncDataToJSON(data){
    var result = null;
    if(data != null){
      data = data.replace(/\|/g , ",");
      data = data.replace(/\\"/g , "\"");
      result = JSON.parse(data);
    }
    return result;
  }

  _onNotification(data){
    console.log("Received notification: " + JSON.stringify(data));
    this.props.getMessages();
  }

  _onMessage(messageEvent){
    console.log("received notification message: ["+messageEvent.message+"] on channel [" + messageEvent.channel+"]");
  }

  render(){
    return null;
  }
}
module.exports = NotificationHandler;
