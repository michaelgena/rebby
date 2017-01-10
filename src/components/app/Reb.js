'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid} from 'react-native';
import Button from 'react-native-button';
import dismissKeyboard from 'dismissKeyboard';
var ExpandingTextInput = require("./ExpandingTextInput");
var Clipboard = require('react-native-clipboard');
import Radio, {RadioButton} from 'react-native-simple-radio-button';

import Icon from 'react-native-vector-icons/Ionicons';

var KDSocialShare = require('NativeModules').KDSocialShare;

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


var toolbarActions = [
  {title: 'Re-use', show: 'always'}
];
class Reb extends Component {

  constructor(props) {
    super(props);

    let textInputHeight = 0;
    if (Platform.OS === 'android'){
      textInputHeight = 20;
    }
    var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
    this.viewMaxHeight = Dimensions.get('window').height - textInputHeight;
    this.viewMaxWidth = Dimensions.get('window').width

    this.state = {
       rebus:this.props.rebus,
       height: new Animated.Value(this.viewMaxHeight),
       hideShare: true,
       hideShareAndroid: true
    };
  }

  updateBadge(){
    this.props.updateBadge();
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }

  tweet() {
    KDSocialShare.tweet({
        'text':this.state.rebus,
        'link':'',
        'imagelink':'',
      },
      (results) => {
        console.log(results);
      }
    );
  }

  shareOnFacebook() {

    KDSocialShare.shareOnFacebook({
        'text':this.state.rebus,
        'link':'',
        'imagelink':'',
      },
      (results) => {
        console.log(results);
      }
    );
  }

  copyToClipboard(){
    Clipboard.set(this.state.rebus);
    MessageBarManager.showAlert({
      alertType: "info",
      title: "Copied in your clipboard.",
      titleNumberOfLines: 1,
      messageNumberOfLines: 0,
    });
  }

  navNewReb(){
    this.props.navigator.push({
      id: 'newReb',
      passProps: {rebus:this.props.rebus, text:this.props.text, language: this.props.language},
    })
  }

  _onActionSelected(position) {
    if(toolbarActions[position].title == "Re-use"){
      this.navNewReb();
    }
  }

  render() {
    if (Platform.OS === 'android'){
      return (
        <Animated.View
          style={{
            height: this.state.height,
            justifyContent: 'flex-end'
          }}
        >
        <View style={styles.container}>
          <View>
            <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        navIcon={require('./ic_arrow_back_white_24dp.png')}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'black'}/>
          </View>
          <ScrollView>
            <Text style={styles.rebusAndroid}> {this.state.rebus}</Text>
            <View style={styles.triangleCorner} />
              <View style={styles.shareContainer}>
                <TouchableHighlight onPress={this.copyToClipboard.bind(this)}>
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 50,backgroundColor:'#CCCCCC'}}>
                    <Text style={{color:'#ffffff',fontWeight:'800',}}>Copy </Text><Icon name="ios-clipboard" size={25} color="#FFFFFF"/>
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
          <MessageBarAlert ref="alert" />

        </Animated.View>
      );
    }else{
      return (
        <Animated.View
          style={{
            height: this.state.height,
            justifyContent: 'flex-end'
          }}
        >
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.rebus}> {this.state.rebus}</Text>
            <View style={styles.triangleCorner} />
              <View style={styles.shareContainer}>
                <TouchableHighlight onPress={this.tweet.bind(this)}>
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 50,backgroundColor:'#00aced'}}>
                   <Text style={{color:'#ffffff',fontWeight:'800'}}>Share </Text><Icon name="logo-twitter" size={25} color="#FFFFFF" />
                  </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.shareOnFacebook.bind(this)}>
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 50,backgroundColor:'#3b5998'}}>
                   <Text style={{color:'#ffffff',fontWeight:'800',}}>Share </Text><Icon name="logo-facebook" size={25} color="#FFFFFF" />
                  </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.copyToClipboard.bind(this)}>
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 50,backgroundColor:'#CCCCCC'}}>
                    <Text style={{color:'#ffffff',fontWeight:'800',}}>Copy </Text><Icon name="ios-clipboard" size={25} color="#FFFFFF"/>
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
          <MessageBarAlert ref="alert" />

        </Animated.View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#F9F9F9'
  },
  input:{
    height: 50,
    fontSize: 18,
    fontWeight: 'bold',
    /*borderColor: 'gray',
    borderWidth: 1,*/
    backgroundColor: '#FFFFFF',
    marginLeft: 15,
    marginRight: 15
  },
  button:{
    height: 40,
    backgroundColor: '#05ABF1',
    marginLeft: 15,
    marginRight: 15,
    marginTop:10,
  },
  buttonText:{
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop:8,
    alignItems: 'center',
    color: "#FFFFFF"
  },

  textInputContainer: {
    alignSelf: 'stretch',
    borderColor: '#b2b2b2',
    borderTopWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingLeft: 10,
    paddingRight: 10
  },
  shareContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 200,
    backgroundColor: '#FFF',
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 15,
  },
  sendButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginLeft: 5,
  },
  rebusAndroid: {
    fontFamily: 'emojione_android',
    fontSize: 30,
    alignSelf: 'stretch',
    marginTop: 5,
    marginRight: 5,
    color: 'black',
    borderRadius: 15,
    paddingLeft: 14,
    paddingRight: 5,
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#FDF058',
  },
  rebus: {
    fontSize: 30,
    alignSelf: 'stretch',
    marginTop: 5,
    marginRight: 5,
    color: 'black',
    borderRadius: 15,
    paddingLeft: 14,
    paddingRight: 5,
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#FDF058',
  },
  info:{
    paddingTop: 65,
    backgroundColor : '#007bff'
  },
  toolbar: {
    backgroundColor: '#FDF058',
    height: 56,
  },
  triangleCorner: {
    alignSelf: 'flex-end',
    marginRight: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#FDF058',
    transform: [
      {rotate: '90deg'}
    ]
  }
})
module.exports = Reb;
