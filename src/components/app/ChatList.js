//'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet,ListView,TouchableHighlight,ActivityIndicatorIOS, AsyncStorage, Platform, ToolbarAndroid, Dimensions, RefreshControl, Image, ScrollView, Animated } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import RebChat from './RebChat';
import Icon from 'react-native-vector-icons/Ionicons';
import Badge from 'react-native-smart-badge';
import NotificationHandler from './NotificationHandler';

var styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      paddingTop: Platform.OS === 'android' ? 0 : 30,
    },
    title: {
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        color: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        color: '#656565',
        margin: 5
    },
    separator: {
       height: 1,
       backgroundColor: '#DDDDDD'
    },
   	listView: {
       backgroundColor: '#FFFFFF',
			 marginTop: Platform.OS === 'android' ? 0 : 65,
       flex: 1,
       flexDirection: 'column',
   },
   loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
   },
   toolbar: {
     backgroundColor: '#FFFFFF',
     height: 56,
     alignItems: 'center'
   },
   image: {
      height: 50,
      width: 50,
      borderRadius: 25,
      margin: 5,
      alignSelf: 'center',
    },
    nickname:{
      fontSize: 16,
      marginTop: 15,
      color: 'black',
      flex: 1
    },
    message: {
      fontSize: 16,
      borderRadius: 15,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 10,
      paddingTop: 8,
      marginLeft: Platform.OS === 'android' ? 15 : 5,
      marginTop: 5,
      color: 'black',
      justifyContent: 'center',
      backgroundColor: '#FDF058',
      alignSelf: 'stretch',
    },
    messageContainer: {
      flex: 1,
      justifyContent: 'center',
      marginTop: Platform.OS === 'android' ? 0 : 65,
    },
    triangleCorner: {
      alignSelf: 'flex-start',
      marginLeft: 20,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: 20,
      borderTopWidth: 20,
      borderRightColor: 'transparent',
      borderTopColor: '#FDF058'
  },
  rebusAndroid: {
    fontSize: 30,
    fontFamily: 'emojione_android',
    alignSelf: 'stretch',
    //marginTop: 5,
    marginRight: 20,
    color: 'black',
    borderRadius: 15,
    //paddingLeft: 5,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
    //marginLeft: 5,
    justifyContent: 'center',
    //backgroundColor: '#FDF058',
  },
  rebus: {
    fontSize: 30,
    alignSelf: 'stretch',
    //marginTop: 5,
    marginRight: 20,
    color: 'black',
    borderRadius: 15,
    //paddingLeft: 5,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
    //marginLeft: 5,
    justifyContent: 'center',
    //backgroundColor: '#FDF058',
  },
});

var toolbarActions = [
  {title: 'New', show: 'always'},
  { title: 'Contacts', iconName: 'md-contact', iconSize: 30, show: 'always' },
  { title: 'Chats', iconName: 'md-chatbubbles', iconSize: 30, show: 'always' },
  { title: 'Settings', iconName: 'md-settings', iconSize: 30, show: 'always' },
];

class ChatList extends Component {

	constructor(props) {
    super(props);
     this.state = {
     		isLoading: true,
        reloading: false,
        nbItems: 0,
        isOnBoarding: true,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height-20,
        dataSource: new ListView.DataSource({
      		rowHasChanged: (row1, row2) => row1 !== row2
      	})
     };
		 this._currentPageIndex = 0;
	   this._hasNextPage = true;
	   this._isFetching = false;
		 this._entries = [];

     this.fetchData();
  }

  addOneToBadge(){
    this.props.addOneToBadge();
  }

  refreshChatList(){
    this.fetchData();
  }

  removeOneToBadge(){
    this.props.removeOneToBadge();
    this.fetchData();
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  fetchData() {
    AsyncStorage.getItem("chatList").then((chats) => {
      //console.log("Rebs: "+rebs);
      if(chats !== null){
        chats = chats.split(",");
        this.addRebbot(chats);
        this.state.nbItems = chats.length;
        console.log("Chats Length: "+this.state.nbItems);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(chats),
          isLoading: false,
          reloading: false
        });
      }else{
        var chats = [];
        this.state.nbItems = 1;
        this.addRebbot(chats);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(chats),
          isLoading: false,
          reloading: false
        });
      }
    }).done();
  }

  addRebbot(chatList){
    var index = -1;
    for(var i=0; i<chatList.length; i++){
      chatAsJSON = this.asyncDataToJSON(chatList[i]);
      if(chatAsJSON.usrToken == "rebbot"){
        index = i;
        break;
      }
    }
    if(index == -1){
      var chat = {};
      chat.givenName = "Rebbot";
      chat.usrToken = "rebbot";
      chat.lastMessage = "H🅰ve ⛽-el+n! ♥";
      chat.lastDate = Date.now();
      chat.channel = "rebbot";
      chat.nbUnreadMessage = 4;
      var chatAsString = JSON.stringify(chat);
      chatAsString = chatAsString.replace(/,/g , "|");
      chatAsString = chatAsString.replace(/"/g , "\\\"");
      chatList.unshift(chatAsString);

      var rebs = [];
      this.addRebbotMessage(rebs, "Hi! I'm Rebbot. I'm here to help you use Rebby.");
      this.addRebbotMessage(rebs, "You can create a Reb then share it with your friends");
      this.addRebbotMessage(rebs, "Or chat directly with your contacts.");
      this.addRebbotMessage(rebs, "H🅰ve ⛽-el+n! ♥ ");
      AsyncStorage.setItem("rebbot", rebs.toString());
      AsyncStorage.setItem("chatList", chatList.toString());
      this.props.addOneToBadge();
    }
  }

  addRebbotMessage(rebs, message){
    var reb = {};
    reb.text = message;
    reb.rebus = message;
    reb.date = Date.now();
    reb.language = "EN";
    reb.in = true;
    var rebAsString = JSON.stringify(reb);
    rebAsString = rebAsString.replace(/,/g , "|");
    rebAsString = rebAsString.replace(/"/g , "\\\"");
    rebs.push(rebAsString);
    return rebs;
  }

  _onRefresh() {
    this.setState({reloading: true});
    this.fetchData();
  }

	async _fetchCurrentPage() {
    if (this._isFetching || !this._hasNextPage) {
	     return;
	  }
	}

	_onEndReached() {
	   this._fetchCurrentPage().done();
	}

  asyncDataToJSON(data){
    var result = null;
    if(data != null){
      data = data.replace(/\|/g , ",");
      data = data.replace(/\\"/g , "\"");
      result = JSON.parse(data);
    }
    return result;
  }

 updateBadge(channel){
    var chatList = [];
    var chatAsJSON= {};
    AsyncStorage.getItem("chatList").then((chats) => {
      if(chats !== null){
        var index = -1;
        chatList = chats.split(",");
        for(var i=0; i<chatList.length; i++){
          chatAsJSON = this.asyncDataToJSON(chatList[i]);
          console.log("Chat info:" + JSON.stringify(chatAsJSON));
          if(chatAsJSON.channel == channel){
            index = i;
            break;
          }
        }
        if(index > -1){
          chatList.splice(index, 1);
          if(chatAsJSON.nbUnreadMessage > 0){
            this.props.removeOneToBadge();
          }
          chatAsJSON.nbUnreadMessage = 0;
          var chatAsString = JSON.stringify(chatAsJSON);
          chatAsString = chatAsString.replace(/,/g , "|");
          chatAsString = chatAsString.replace(/"/g , "\\\"");
          chatList.splice(index, 0, chatAsString);
          AsyncStorage.setItem("chatList", chatList.toString());
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(chatList),
            isLoading: false,
            reloading: false
          });
        }
      }
    }).done();
  }

  navRebChat(rebChat){
    this.updateBadge(rebChat.channel);
    this.props.navigator.push({
      id: 'rebChat',
      title: rebChat.givenName,
      component: RebChat,
      passProps: {givenName:rebChat.givenName, channel:rebChat.channel, token:rebChat.usrToken, removeOneToBadge: ()=>this.removeOneToBadge()},
    })
  }
  navNewReb(){
    this.props.navigator.push({
      id: 'newReb'
    })
  }

  _onActionSelected(position) {
    if(toolbarActions[position].title == "New"){
      this.navNewReb();
    }
    if(toolbarActions[position].title == "Contacts"){
      this.props.navigator.push({
        id: 'contacts'
      })
    }
    if(toolbarActions[position].title == "Chats"){
      this.props.navigator.push({
        id: 'rebChat'
      })
    }
    if(toolbarActions[position].title == "Settings"){
      this.props.navigator.push({
        id: 'realtimeRCT'
      })
    }
  }

  render() {
    //AsyncStorage.removeItem("myRebs");
    //AsyncStorage.removeItem("isOnBoarding");
    if (this.state.isLoading) {
         return this.renderLoadingView();
    }
    if (Platform.OS === 'android'){
      return (
          <View style={{flex: 1}}>
            <Icon.ToolbarAndroid style={styles.toolbar}
                    title="Home"
                    titleColor={'black'}
                    actions={toolbarActions}
                    onActionSelected={this._onActionSelected.bind(this)}/>
          <View style={styles.container}>
       		<ListView
              refreshControl={
                <RefreshControl
                refreshing={this.state.reloading}
                onRefresh={this._onRefresh.bind(this)}/>
              }
            	dataSource={this.state.dataSource}
            	renderRow={this.renderChat.bind(this)}
  						onEndReached={this._onEndReached.bind(this)}
            	style={styles.listView}
            	/>
          </View>
        </View>
      );
    }else{
      return (
        <View style={{flex: 1}}>
       		<ListView
              refreshControl={
                <RefreshControl
                refreshing={this.state.reloading}
                onRefresh={this._onRefresh.bind(this)}/>
              }
            	dataSource={this.state.dataSource}
            	renderRow={this.renderChat.bind(this)}
  						onEndReached={this._onEndReached.bind(this)}
            	style={styles.listView}
            	/>
            <NotificationHandler addOneToBadge={this.addOneToBadge.bind(this)} refreshChatList={this.refreshChatList.bind(this)}/>
          </View>
      );
    }
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

	renderChat(chat) {
    if(this.state.nbItems == 0){
      console.log("Empty");
      return (
  					<View style={{flex:1}}>
  							 <View style={{alignItems: 'center',justifyContent:'center', width: this.state.width, height: 50,backgroundColor:'#CCCCCC'}}>
  									<Text style={{color:'#ffffff',fontWeight:'800',}} numberOfLines={1}>No Chat list to display for now. Pull to refresh.</Text>
  							</View>
  							<View style={styles.separator} />
  					</View>
  		);
    }
    chat = chat.replace(/\|/g , ",");
    chat = chat.replace(/\\"/g , "\"");
    var rebChat = JSON.parse(chat);
		return (
  		<TouchableHighlight onPress={ () => this.navRebChat(rebChat)} underlayColor="#FFFFFF">
					<View style={{flex:1, flexDirection: 'row'}}>
              <View style={{paddingLeft: 10, paddingRight: 5, paddingTop: 3}}>
                {rebChat.usrToken == "rebbot" &&
                <Image style={styles.image} source={require('../../img/rebbot.png')}/>
                }
                {rebChat.usrToken != "rebbot" &&
                <Icon name="ios-contact" size={60} color="#CCCCCC"/>
                }
              </View>
              <View>
                <View style={{height: 25, width: this.state.width, marginTop: 10}}>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <View>
                    <Text style={{fontWeight:'bold'}}>{rebChat.givenName}</Text>
                    </View>
                    <View>
                    {typeof(rebChat.nbUnreadMessage) != "undefined" && rebChat.nbUnreadMessage>0 &&
                    <Badge minWidth={18} minHeight={18} textStyle={{color: '#fff'}}>
                      {rebChat.nbUnreadMessage}
                    </Badge>
                    }
                    </View>
                  </View>
                </View>
						    <View style={{width: this.state.width-80}}>
									<Text style={ Platform.OS === 'ios' ? styles.rebus : styles.rebusAndroid} numberOfLines={1}>{rebChat.lastMessage}</Text>
							  </View>
							  <View style={styles.separator} />
              </View>
					</View>
			</TouchableHighlight>
		);
  }
}
module.exports = ChatList;
