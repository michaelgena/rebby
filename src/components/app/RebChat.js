'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid, ListView, RefreshControl, KeyboardAvoidingView} from 'react-native';
import RebInput from './RebInput';
import realtimeIOS from '../../../RCTRealtimeMessagingIOS';
import realtimeAndroid from '../../../RCTRealtimeMessagingAndroid';
import Icon from 'react-native-vector-icons/Ionicons';
var KDSocialShare = require('NativeModules').KDSocialShare;
var Clipboard = require('react-native-clipboard');

var RCTRealtimeMessaging;
if (Platform.OS === 'ios'){
  RCTRealtimeMessaging = new realtimeIOS();
}
if (Platform.OS === 'android'){
  RCTRealtimeMessaging = new realtimeAndroid();
}
var conf = require("../../data/conf.js");

class RebChat extends Component {

  constructor(props) {
    super(props);
    let height = (Dimensions.get('window').height);
    let textInputHeight = 0;
    if (Platform.OS === 'android'){
      textInputHeight = 25;
    }

    this.viewMaxHeight = height + textInputHeight;

    this.state = {
       isLoading: true,
       reloading: false,
       nbItems: 0,
       isOnBoarding: true,
       width: Dimensions.get('window').width,
       height: new Animated.Value(this.viewMaxHeight),
       listHeight: 0,
       footerY: 0,
       reloaded: false,
       myUserName:"",
       myToken:"",
       destinatorToken:this.props.token,

       channel: this.props.channel,
       appKey: conf.get().appKey,
       token: conf.get().token,
       connectionMetadata: conf.get().connectionMetadata,
       clusterUrl: conf.get().clusterUrl,
       projectId: conf.get().projectId,

       dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2
       })
    };

    this._currentPageIndex = 1;
    this._hasNextPage = true;
    this._messages = [];

    AsyncStorage.getItem("userInfo").then((userInfo) => {
      if(userInfo != null){
        userInfo = userInfo.replace(/\|/g , ",");
        userInfo = userInfo.replace(/\\"/g , "\"");
        var userInfoAsJSON = JSON.parse(userInfo);
        console.log("User info: "+JSON.stringify(userInfoAsJSON));
        this.setState({
          myUserName: userInfoAsJSON.name,
          myToken: userInfoAsJSON.token
        });
      }
    }).done();

  }

  componentDidMount() {
    this.fetchData();
    //console.log('Displayed Chat component.');
  }

  componentDidUpdate(){
    if(this.state.footerY > this.state.listHeight && !this.state.reloaded){
      var scrollDistance = this.state.listHeight - this.state.footerY;
      this.refs.list.getScrollResponder().scrollTo({x:0,y:-scrollDistance, animated: true});
    }
  }

  componentWillUnmount() {

  }

  _onRefresh() {
    this.setState({
      reloading: true,
      reloaded: true
    });
    var messages = this._messages;
    if(messages !== null){
      if(messages.length > this._currentPageIndex * 10){
        messages = messages.slice(Math.max(messages.length - this._currentPageIndex * 10, 0));
        this._currentPageIndex ++;
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(messages),
        reloading: false
      });
    }
  }

  fetchData() {
    AsyncStorage.getItem(this.state.channel).then((messages) => {
      if(messages !== null){
        messages = messages.split(",");
        this._messages = messages;
        if(messages.length > 10){
          messages = messages.slice(Math.max(messages.length - 10, 0));
        }
        this.state.nbItems = messages.length;

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(messages),
          isLoading: false,
          reloading: false
        });
      }else{
        console.log("it's empty");
        var messages = [];
        messages.push("{\"status\":\"empty\"}");
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(messages),
          isLoading: false,
          reloading: false
        });
      }

    }).done();
  }

  renderLoadingView() {
    if (Platform.OS === 'ios'){
      return (
        <View style={styles.loading}>
          <Spinner size='large' visible={true} overlayColor="#FDF058"/>
        </View>
      );
    }else{
      return null;
    }
  }

  onKeyboardDidShow(e) {
    if(Platform.OS === 'android'){
      Animated.timing(this.state.height, {
          toValue: this.viewMaxHeight - 40,
          duration: 200,
        }).start();
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

  tweet(reb) {
    KDSocialShare.tweet({
        'text':reb,
        'link':'',
        'imagelink':'',
      },
      (results) => {
        console.log(results);
      }
    );
  }

  shareOnFacebook(reb) {
    KDSocialShare.shareOnFacebook({
        'text':reb,
        'link':'',
        'imagelink':'',
      },
      (results) => {
        console.log(results);
      }
    );
  }

  copyToClipboard(reb){
    Clipboard.set(reb);
  }

  renderMessage(message) {
    if(this.state.nbItems == 0){
      console.log("Empty");
      return (
				<View style={{flex:1}}>
						 <View style={{alignItems: 'center',justifyContent:'flex-start', width: this.state.width, height: 50,backgroundColor:'#ffffff'}}>
								<Text style={{color:'#CCCCCC',fontWeight:'800',}} >No messages to display.</Text>
						</View>
				</View>
  		);
    }
    message = message.replace(/\|/g , ",");
    message = message.replace(/\\"/g , "\"");

    var msg = JSON.parse(message);
    if(msg.in !== null && msg.in == true){
      var reb = msg.rebus.replace(/ /g, "\u2000");
      return (
        <View>
          <View style={{flex:1, flexDirection: 'row',justifyContent:'flex-start'}}>
            <View style={{flex:1, flexDirection: 'column',}}>
              <Text style={Platform.OS === 'android'? styles.leftRebusAndroid : styles.leftRebus}>{msg.rebus.replace(/ /g, "\u2000")}</Text>

              {typeof(msg.share) != "undefined"  &&
              <View style={{marginLeft: 20, marginRight: 5}}>
                <ScrollView>
                  <View >
                      <TouchableHighlight onPress={()=> this.tweet(reb)}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height: 50,backgroundColor:'#00aced'}}>
                         <Text style={{color:'#ffffff',fontWeight:'800'}}>Share </Text><Icon name="logo-twitter" size={25} color="#FFFFFF" />
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight onPress={()=> this.shareOnFacebook(reb)}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height: 50,backgroundColor:'#3b5998'}}>
                         <Text style={{color:'#ffffff',fontWeight:'800',}}>Share </Text><Icon name="logo-facebook" size={25} color="#FFFFFF" />
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight onPress={()=> this.copyToClipboard(reb)}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height: 50,backgroundColor:'#f4f4f4'}}>
                          <Text style={{color:'#ffffff',fontWeight:'800',}}>Copy </Text><Icon name="ios-clipboard" size={25} color="#FFFFFF"/>
                        </View>
                      </TouchableHighlight>
                  </View>
                </ScrollView>
              </View>
              }

              <View style={styles.triangleLeftCorner} />
            </View>
            <View style={{width:60}}/>
          </View>
          <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
        </View>
  		);
    }
      return (
        <View>
          <View style={{flex:1, flexDirection: 'row',}}>
            <View style={{width:60}}/>
            <View style={{flex:1, flexDirection: 'column',}}>
              <Text style={Platform.OS === 'android'? styles.rebusAndroid : styles.rebus}>{msg.rebus.replace(/ /g, "\u2000")}</Text>
              <View style={styles.triangleCorner} />
            </View>
          </View>
          <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
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
            <ToolbarAndroid style={styles.toolbar}
                        title={this.props.givenName}
                        navIcon={require('./ic_arrow_back_white_24dp.png')}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'black'}/>


          <ListView ref="list"
            onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
            onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
            refreshControl={
              <RefreshControl
              refreshing={this.state.reloading}
              onRefresh={this._onRefresh.bind(this)}/>
            }
            dataSource={this.state.dataSource}
            renderRow={this.renderMessage.bind(this)}
            style={styles.listView}
            onLayout={(event) => {
              var layout = event.nativeEvent.layout;
              this.setState({
                listHeight : layout.height
              });
            }}
            renderFooter={() => {
              return <View onLayout={(event)=>{
                var layout = event.nativeEvent.layout;
                this.setState({
                  footerY : layout.y
                });
              }}></View>
            }}
          />
          <RebInput
            realtimeMessaging={RCTRealtimeMessaging}
            channel={this.state.channel}
            appKey={this.state.appKey}
            privateKey={this.state.token}
            myUserName={this.state.myUserName}
            myToken={this.state.myToken}
            destinatorToken={this.state.destinatorToken}
            fetchData={this.fetchData.bind(this)}
            buttonLabel={"Send"}
          />
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
            refreshControl={
              <RefreshControl
              refreshing={this.state.reloading}
              onRefresh={this._onRefresh.bind(this)}/>
            }
            dataSource={this.state.dataSource}
            renderRow={this.renderMessage.bind(this)}
            style={styles.listView}
            onLayout={(event) => {
              var layout = event.nativeEvent.layout;
              this.setState({
                listHeight : layout.height
              });
            }}
            renderFooter={() => {
              return <View onLayout={(event)=>{
                var layout = event.nativeEvent.layout;
                this.setState({
                  footerY : layout.y
                });
              }}></View>
            }}
          />
          <KeyboardAvoidingView behavior='padding'>
            <RebInput
              realtimeMessaging={RCTRealtimeMessaging}
              channel={this.state.channel}
              appKey={this.state.appKey}
              privateKey={this.state.token}
              myUserName={this.state.myUserName}
              myToken={this.state.myToken}
              destinatorToken={this.state.destinatorToken}
              fetchData={this.fetchData.bind(this)}
              buttonLabel={"Send"}
            />
          </KeyboardAvoidingView>

        </Animated.View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  leftRebusAndroid: {
    fontSize: 30,
    fontFamily: 'emojione_android',
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
    backgroundColor: '#f4f4f4',
  },
  leftRebus: {
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
    backgroundColor: '#f4f4f4',
  },
  rebusAndroid: {
    fontSize: 30,
    fontFamily: 'emojione_android',
    alignSelf: 'stretch',
    marginTop: 5,
    marginRight: 20,
    color: 'black',
    borderRadius: 15,
    paddingLeft: 5,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: '#FDF058',
  },
  rebus: {
    fontSize: 30,
    alignSelf: 'stretch',
    marginTop: 5,
    marginRight: 20,
    color: 'black',
    borderRadius: 15,
    paddingLeft: 5,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: '#FDF058',
  },
  triangleCorner: {
    alignSelf: 'flex-end',
    marginRight: 35,
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
  triangleLeftCorner: {
    alignSelf: 'flex-start',
    marginLeft: 35,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#f4f4f4'
  },
  loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  listView: {
     backgroundColor: '#FFFFFF',
     marginTop: Platform.OS === 'android' ? 0 : 65,
     flex: 1,
     flexDirection: 'column',
   },
   toolbar: {
     backgroundColor: '#FDF058',
     height: 56,
     alignItems: 'center'
   },
   shareContainer: {
     flex:1,
     alignSelf: 'stretch',
     flexDirection: 'row',
   }
})

export default RebChat;
