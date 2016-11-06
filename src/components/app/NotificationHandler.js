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

    var chatList = [];
    var nbUnreadMessage = 0;
    AsyncStorage.getItem("chatList").then((chats) => {
      if(chats !== null){
        var index = -1;
        chatList = chats.split(",");
        for(var i=0; i<chatList.length; i++){
          var chatAsJSON = this.asyncDataToJSON(chatList[i]);

          if(chatAsJSON.usrToken == data.UsrToken){
            index = i;
            nbUnreadMessage = (typeof(chatAsJSON.nbUnreadMessage) != "undefined") ? chatAsJSON.nbUnreadMessage : 0;
            break;
          }
        }
        if(index > -1){
          chatList.splice(index, 1);
        }
      }
      var chat = {};
      chat.givenName = data.UsrName;
      chat.usrToken = data.UsrToken;
      chat.lastMessage = data.message;
      chat.lastDate = data.date;
      chat.channel = data.channel;
      console.log("Do we need to add +1 to badge?" + JSON.stringify(chatAsJSON));
      if(nbUnreadMessage == 0){
        console.log("yes!");
        this.props.addOneToBadge();
      }
      chat.nbUnreadMessage = nbUnreadMessage+1;
      var chatAsString = JSON.stringify(chat);
      chatAsString = chatAsString.replace(/,/g , "|");
      chatAsString = chatAsString.replace(/"/g , "\\\"");
      chatList.unshift(chatAsString);
      AsyncStorage.setItem("chatList", chatList.toString());
      this.props.refreshChatList();
    }).done();

    //Save the message
    var reb = {};
    reb.text = data.text;
    reb.rebus = data.message;
    reb.date = data.date;
    reb.language = data.language;
    reb.in = true;
    var rebAsString = JSON.stringify(reb);
    rebAsString = rebAsString.replace(/,/g , "|");
    rebAsString = rebAsString.replace(/"/g , "\\\"");

    AsyncStorage.getItem(data.channel)
    .then((rebs) => {
      if(rebs !== null){
        rebs = rebs.split(",");
        rebs.push(rebAsString);
        AsyncStorage.setItem(data.channel, rebs.toString());
      }else{
        var rebs = [];
        rebs.push(rebAsString);
        AsyncStorage.setItem(data.channel, rebs.toString());
      }
    }).done();
  }

  _onMessage(messageEvent){
    console.log("received notification message: ["+messageEvent.message+"] on channel [" + messageEvent.channel+"]");
  }

  render(){
    return null;
  }
}
module.exports = NotificationHandler;

/*{
   "applicationKey": "xkCY9Z",
   "privateKey": "oQcrOlauio9V",
   "channel" : "24890663b4e4c91b670041b065007c73",
   "message" : "Mike says:\nTh🏝-land 🏝-land 🐋-ammal+y R🍳-gg+b!",
   "payload" : "{
   	 \"sound\" : \"default\",
     \"badge\" : \"1\",
     \"UsrToken\" : \"24890663b4e4c91b670041b065007c73\",
     \"UsrName\" : \"Mike\",
     \"date\" : \"1478126072129\",
     \"channel\" : \"9054d3c8ee53973c17ec316fdf10a433\",
     \"message\" : \"Th🏝-land 🏝-land 🐋-ammal+y R🍳-gg+b!\",
     \"text\" : \"This is my Reb!\",
     \"language\" : \"EN\"
    }"
}*/
