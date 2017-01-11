'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid, KeyboardAvoidingView, ListView} from 'react-native';
import RebInput from './RebInput';
var Clipboard = require('react-native-clipboard');
var KDSocialShare = require('NativeModules').KDSocialShare;
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Icon from 'react-native-vector-icons/Ionicons';

class NewReb extends Component {

  constructor(props) {
    super(props);
    let height = (Dimensions.get('window').height);
    let textInputHeight = 0;
    if (Platform.OS === 'android'){
      textInputHeight = 25;
    }

    this.viewMaxHeight = height;
    this.viewMaxWidth = Dimensions.get('window').width;
    this.state = {
      height: new Animated.Value(this.viewMaxHeight),
      rebus: "",
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
      MessageBarManager.unregisterMessageBar();
  }

  onKeyboardDidShow(e) {
    if(Platform.OS === 'android'){
      AsyncStorage.getItem("reloaded").then((reloaded) => {
      if(reloaded === "true"){
        Animated.timing(this.state.height, {
            toValue: this.viewMaxHeight - (e.endCoordinates.height/2 + 160),
            duration: 200,
          }).start();
      }else{
        Animated.timing(this.state.height, {
            toValue: this.viewMaxHeight - 40,
            duration: 200,
          }).start();
      }
      });
    }else{
      Animated.timing(this.state.height, {
          toValue: this.viewMaxHeight - (e.endCoordinates.height/2 - 10),
          duration: 200,
        }).start();
    }
  }

  onKeyboardDidHide(e){
    Animated.timing(this.state.height, {
        toValue: this.viewMaxHeight,
        duration: 200,
      }).start();
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

  setRebus(rebus){
      this.state.rebus = rebus;
      var messages = [];
      messages.push(rebus);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(messages)
      });
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
    MessageBarManager.registerMessageBar(this.refs.alert);
    Clipboard.set(this.state.rebus);
    MessageBarManager.showAlert({
      alertType: "info",
      title: "Copied in your clipboard.",
      titleNumberOfLines: 1,
      messageNumberOfLines: 0,
    });
  }

  fetchData() {
    AsyncStorage.getItem("myRebs").then((rebs) => {
      if(rebs !== null){
        rebs = rebs.split(",");
        this.state.nbItems = rebs.length;
        var lastReb = [];
        lastReb.push(rebs[0]);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(lastReb)
        });
      }
    }).done();
  }

  resetData(){
    var rebs = [];
    rebs.push("{\"status\":\"empty\"}");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rebs)
    });
  }

  renderMessage(rebus){
    rebus = rebus.replace(/\|/g , ",");
    rebus = rebus.replace(/\\"/g , "\"");
    console.log("rebus:"+rebus);
    var reb = JSON.parse(rebus);
    if(typeof(reb.status) != "undefined" && reb.status == "empty"){
      return null;
    }
    this.state.rebus = reb.rebus;
    return (
      <View>
        <View style={{flex:1, flexDirection: 'row',}}>
          <View style={{width:14}}/>
          <View style={{flex:1, flexDirection: 'column',}}>
            <Text style={Platform.OS === 'android'? styles.rebusAndroid : styles.rebus}>{reb.rebus}</Text>
            <View style={styles.triangleCorner} />
          </View>
        </View>
        <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
        {Platform.OS === 'ios' &&
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
        }
        {Platform.OS === 'android' &&
        <View style={styles.shareContainer}>
          <TouchableHighlight onPress={this.copyToClipboard.bind(this)}>
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 50,backgroundColor:'#CCCCCC'}}>
              <Text style={{color:'#ffffff',fontWeight:'800',}}>Copy </Text><Icon name="ios-clipboard" size={25} color="#FFFFFF"/>
            </View>
          </TouchableHighlight>
        </View>
        }
      </View>
    );
  }

  render(){

    if(Platform.OS === 'android'){
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
        <ListView ref="list"
          onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
          onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
          dataSource={this.state.dataSource}
          renderRow={this.renderMessage.bind(this)}
          style={styles.listView}
        />
        <KeyboardAvoidingView behavior='padding'>
          <RebInput
            isReb={true}
            buttonLabel={"Done"}
            fetchData={this.fetchData.bind(this)}
            resetData={this.resetData.bind(this)}
          />
        </KeyboardAvoidingView>
        </View>
        <MessageBarAlert ref="alert"/>
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
        <ListView ref="list"
          onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
          onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}

          dataSource={this.state.dataSource}
          renderRow={this.renderMessage.bind(this)}
          style={styles.listView}
        />
        <KeyboardAvoidingView behavior='padding'>
          <RebInput
            isReb={true}
            buttonLabel={"Done"}
            fetchData={this.fetchData.bind(this)}
            resetData={this.resetData.bind(this)}
          />
        </KeyboardAvoidingView>
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

  textPlaceContainer: {
    alignSelf: 'stretch',
    borderColor: '#b2b2b2',
    borderTopWidth: 1 / PixelRatio.get(),
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },

  suggestions: {
    alignSelf: 'stretch',
    borderColor: '#b2b2b2',
    borderTopWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    backgroundColor:'#f2f2f2',
    height: 30,
    marginBottom: 50
  },

  shareContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row'
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
  },
})

export default NewReb;
