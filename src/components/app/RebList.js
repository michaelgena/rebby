//'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet,ListView,TouchableHighlight,ActivityIndicatorIOS, AsyncStorage, Platform, ToolbarAndroid, Dimensions, RefreshControl, Image, ScrollView, Animated } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Reb from './Reb';
import NewReb from './NewReb';
import Icon from 'react-native-vector-icons/Ionicons';
//import RealtimeRCT from './RealtimeRCTAndroid';

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
       backgroundColor: '#FFFFFF'
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
});

var toolbarActions = [
  {title: 'New', show: 'always'},
  { title: 'Contacts', iconName: 'md-contact', iconSize: 30, show: 'always' },
  { title: 'Chats', iconName: 'md-chatbubbles', iconSize: 30, show: 'always' },
  { title: 'Settings', iconName: 'md-settings', iconSize: 30, show: 'always' },
];

class RebList extends Component {

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
  }

  render() {
    //AsyncStorage.removeItem("myRebs");
    //AsyncStorage.removeItem("isOnBoarding");
    if (this.state.isLoading) {
         return this.renderLoadingView();
    }
    else if(this.state.isOnBoarding){
      if (Platform.OS === 'android'){
        return (
          <Animated.View
            style={{
              height: this.state.height,
              justifyContent: 'flex-start'
            }}
          >

            <Icon.ToolbarAndroid style={styles.toolbar}
                  title="Home"
                  titleColor={'black'}
                  actions={toolbarActions}
                  onActionSelected={this._onActionSelected.bind(this)}/>
                  <ScrollView>
                  <View style={styles.messageContainer}>

                    <View style={{flex:1, flexDirection: 'column',alignItems: 'center', justifyContent:'center',}}>
                      <Image style={styles.image} source={require('../../img/rebbot.png')}/>
                    </View>

                    <View style={{flex:1, flexDirection: 'row',}}>
                      <View style={{flex:1, flexDirection: 'column',}}>
                        <Text style={styles.message}>Hi! I'm Rebbot. I'm here to help you use Rebby.</Text>
                        <View style={styles.triangleCorner} />
                      </View>
                      <View style={{width:60}}/>
                    </View>

                    <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

                    <View style={{flex:1, flexDirection: 'row',}}>
                      <View style={{flex:1, flexDirection: 'column',}}>
                        <Text style={styles.message}>To start creating a rebus press on the "New" button above.</Text>
                        <View style={styles.triangleCorner} />
                      </View>
                      <View style={{width:60}}/>
                    </View>

                    <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
                    <View style={{flex:1, flexDirection: 'row',}}>
                      <View style={{flex:1, flexDirection: 'column',}}>
                        <Text style={styles.message}>Type your text and press "Done". You can then copy/paste it and share it with your friends.</Text>
                        <View style={styles.triangleCorner} />
                      </View>
                      <View style={{width:60}}/>
                    </View>

                    <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

                    <View style={{flex:1, flexDirection: 'row',}}>
                      <View style={{flex:1, flexDirection: 'column',}}>
                        <Text style={styles.message}>One last thing. You can browse back into your rebus history from the Home page.</Text>
                        <View style={styles.triangleCorner} />
                      </View>
                      <View style={{width:60}}/>
                    </View>

                    <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

                    <View style={{flex:1, flexDirection: 'row'}}>
                      <View style={{flex:1, flexDirection: 'column',}}>
                        <Text style={styles.message}>H🅰ve ⛽-el+n! ♥ </Text>
                        <View style={styles.triangleCorner} />
                      </View>
                      <View style={{width:60}}/>
                    </View>
                  </View>

                  </ScrollView>
                  <TouchableHighlight onPress={() => this.doneOnBoarding()}>
                    <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 50,backgroundColor:'#CCCCCC'}}>
                      <Text style={{color:'#ffffff',fontWeight:'800',}}>Got it!</Text>
                    </View>
                  </TouchableHighlight>

          </Animated.View>
        );
      }else{
        return (
          <View style={styles.messageContainer}>
            <ScrollView>
              <View style={{flex:1, flexDirection: 'column',alignItems: 'center', justifyContent:'center',}}>
                <Image style={styles.image} source={require('../../img/rebbot.png')}/>
              </View>

              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.message}>Hi! I'm Rebbot. I'm here to help you use Rebby.</Text>
                  <View style={styles.triangleCorner} />
                </View>
                <View style={{width:60}}/>
              </View>

              <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.message}>To start creating a rebus press on the "New" button above.</Text>
                  <View style={styles.triangleCorner} />
                </View>
                <View style={{width:60}}/>
              </View>

              <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.message}>Type your text and press "Done". You can then copy/paste it and share it with your friends.</Text>
                  <View style={styles.triangleCorner} />
                </View>
                <View style={{width:60}}/>
              </View>

              <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.message}>One last thing. You can browse back into your rebus history from the Home page.</Text>
                  <View style={styles.triangleCorner} />
                </View>
                <View style={{width:60}}/>
              </View>

              <View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>

              <View style={{flex:1, flexDirection: 'row'}}>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.message}>H🅰ve ⛽-el+n! ♥ </Text>
                  <View style={styles.triangleCorner} />
                </View>
                <View style={{width:60}}/>
              </View>

              <TouchableHighlight onPress={() => this.doneOnBoarding()}>
                <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 50,backgroundColor:'#CCCCCC', marginBottom: 30}}>
                  <Text style={{color:'#ffffff',fontWeight:'800',}}>Got it!</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>
          </View>
        );
      }
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
            	renderRow={this.renderRebus.bind(this)}
  						onEndReached={this._onEndReached.bind(this)}
            	style={styles.listView}
            	/>
          </View>
        </View>
      );
    }else{
      return (
     		<ListView
            refreshControl={
              <RefreshControl
              refreshing={this.state.reloading}
              onRefresh={this._onRefresh.bind(this)}/>
            }
          	dataSource={this.state.dataSource}
          	renderRow={this.renderRebus.bind(this)}
						onEndReached={this._onEndReached.bind(this)}
          	style={styles.listView}
          	/>
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

	renderRebus(rebus) {
    if(this.state.nbItems == 0){
      console.log("Empty");
      return (
  					<View style={{flex:1}}>
  							 <View style={{alignItems: 'center',justifyContent:'center', width: this.state.width, height: 50,backgroundColor:'#CCCCCC'}}>
  									<Text style={{color:'#ffffff',fontWeight:'800',}} numberOfLines={1}>No history to display for now. Pull to refresh.</Text>
  							</View>
  							<View style={styles.separator} />
  					</View>
  		);
    }

    rebus = rebus.replace(/\|/g , ",");
    rebus = rebus.replace(/\\"/g , "\"");
    //console.log("rebus:"+rebus);
    var reb = JSON.parse(rebus);
		return (
  		<TouchableHighlight onPress={ () => this.navReb(reb)} underlayColor="#dddddd">
					<View>
							 <View style={{	backgroundColor: '#FDF058', width: this.state.width}}>
									<Text style={ Platform.OS === 'ios' ? styles.rebus : styles.rebusAndroid} numberOfLines={1}>{reb.rebus}</Text>
							</View>
							<View style={styles.separator} />
					</View>
			</TouchableHighlight>
		);
  }

  componentDidMount() {
    AsyncStorage.getItem("isOnBoarding").then((value) => {
      console.log("AsyncStorage:"+value);
      if(value !== null && value === "false"){
        this.state.isOnBoarding = false;
      }
    }).done();
    this.fetchData();
  }

  fetchData() {
    AsyncStorage.getItem("myRebs").then((rebs) => {
      //console.log("Rebs: "+rebs);
      if(rebs !== null){
        rebs = rebs.split(",");
        this.state.nbItems = rebs.length;
        console.log("Rebs Length: "+this.state.nbItems);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rebs),
          isLoading: false,
          reloading: false
        });
      }else{
        console.log("it's empty");
        var rebs = [];
        rebs.push("{\"status\":\"empty\"}");
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rebs),
          isLoading: false,
          reloading: false
        });
      }
    }).done();
  }

  _onRefresh() {
    this.setState({reloading: true});
    this.fetchData();
  }

  doneOnBoarding() {
    this.setState({isOnBoarding: false});
    AsyncStorage.setItem("isOnBoarding", "false");
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

  navReb(reb){
    this.props.navigator.push({
      id: 'reb',
      title: 'Reb',
      component: Reb,
      passProps: {rebus:reb.rebus, text:reb.text, language: reb.language},
      rightButtonTitle: 'Re-use',
      onRightButtonPress: () => {
        this.props.navigator.push({
          title: "New",
          component: NewReb,
          passProps: {rebus:reb.rebus, text:reb.text, language: reb.language}
        });}
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
        id: 'chatList'
      })
    }
    if(toolbarActions[position].title == "Settings"){
      this.props.navigator.push({
        id: 'realtimeRCT'
      })
    }
  }

}
module.exports = RebList;
