'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
       hasAccount:false,
       isLoading: true,
       userInfo:"",
       language: "EN"
    };

    AsyncStorage.getItem("language").then((language) => {
      if(language !== null){
        this.setState({
          language: language
        });
      }
      AsyncStorage.setItem("language", this.state.language);
    });
  }

  fetchData(){
    this.setState({
       isLoading: true
    });
    AsyncStorage.getItem("userInfo").then((result) => {
      this.setState({
        isLoading: false
      });
      if(result != null){
        console.log(result);
        this.setState({
          hasAccount: true,
          userInfo: result
        });
      }
    }).done();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
  }

  revokeAccount(){
    //TODO disable account on dailyglancer
    AsyncStorage.removeItem("userInfo");
    this.setState({
      hasAccount: false,
      userInfo: ""
    });
  }

  switchLanguage(){
    if(this.state.language === "EN"){
      this.setState({
          language: "FR"
      });
      AsyncStorage.setItem("language", "FR");
    }else if(this.state.language === "FR"){
      this.setState({
          language: "EN"
      });
      AsyncStorage.setItem("language", "EN");
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

  render(){
    if(this.state.isLoading){
      return this.renderLoadingView();
    }

    if(Platform.OS === "android"){
      if(!this.state.hasAccount){
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
        				<View style={{flex:1}}>
        						 <View style={{marginTop:70, alignItems: 'center',justifyContent:'center', width: this.state.width, height: 50,backgroundColor:'#CCCCCC'}}>
        								<Text style={{color:'#ffffff',fontWeight:'800',}} numberOfLines={1}>No registered account to display for now.</Text>
        						</View>
        						<View style={styles.separator} />
                    <View>
                      <TouchableHighlight onPress={() => this.fetchData(this)} underlayColor="#FFFFFF">
                        <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 40, backgroundColor:'#FDF058', marginTop:10, marginLeft: 10, marginRight: 10}}>
                          <Text style={{fontWeight:'800'}}>Refresh</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
        				</View>
              </ScrollView>
            </View>
            </Animated.View>
    		);
      }else{
        this.state.userInfo = this.state.userInfo.replace(/\|/g , ",");
        this.state.userInfo = this.state.userInfo.replace(/\\"/g , "\"");
        var userInfoAsJSON = JSON.parse(this.state.userInfo);
        console.log(userInfoAsJSON.phoneNumber);
        return (
          <Animated.View
            style={{
              height: this.state.height,
              justifyContent: 'flex-end'
            }}
          >
          <View>
            <View>
              <ToolbarAndroid style={styles.toolbar}
                          title={this.props.title}
                          navIcon={require('./ic_arrow_back_white_24dp.png')}
                          onIconClicked={this.props.navigator.pop}
                          titleColor={'black'}/>
            </View>
              <ScrollView>
                <View style={styles.container}>
                  <View style={{flex:1, flexDirection: 'row', marginLeft: 10, marginRight: 10, paddingLeft: 10, paddingRight: 5, backgroundColor: '#FDF058', height: 90}}>
                    <View style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#FDF058'}}>
                      <Icon name="ios-contact" size={80} color="#CCCCCC"/>
                    </View>
                    <View style={{height: 70, backgroundColor: '#FDF058', paddingTop: 10}}>
                      <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.name}</Text>
                      <Text style={{marginLeft:5}}>Your Phone Number</Text>
                      <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.phoneNumber}</Text>
                    </View>
                  </View>
                  <View>
                    <TouchableHighlight onPress={() => this.revokeAccount(this)} underlayColor="#FFFFFF">
                      <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 40,backgroundColor:'#CCCCCC', marginTop:10, marginLeft: 10, marginRight: 10}}>
                        <Text style={{fontWeight:'800'}}>Disable</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <Text style={{marginTop:20, marginLeft:5, fontWeight:'bold', fontSize: 20}}>Preferences</Text>

                <View style={styles.separator} />
                <View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <TouchableHighlight
                      onPress={this.switchLanguage.bind(this)}
                      underlayColor="#FFFFFF"
                    >
                      <View>
                        <View>
                          <Text style={{marginLeft:5}}>Default Language</Text>
                        </View>
                        <View>
                          <Text style={{marginLeft:5}}>
                          {this.state.language}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.separator} />
              </ScrollView>
            </View>
            </Animated.View>
        );
      }
    }else{
      if(!this.state.hasAccount){
        return (
  				<View style={{flex:1}}>
  						 <View style={{marginTop:65, alignItems: 'center',justifyContent:'center', width: this.state.width, height: 50,backgroundColor:'#CCCCCC'}}>
  								<Text style={{color:'#ffffff',fontWeight:'800',}} numberOfLines={1}>No registered account to display for now.</Text>
  						</View>
  						<View style={styles.separator} />
              <View>
                <TouchableHighlight onPress={() => this.fetchData(this)} underlayColor="#FFFFFF">
                  <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 40, backgroundColor:'#FDF058', marginTop:10, marginLeft: 10, marginRight: 10}}>
                    <Text style={{fontWeight:'800'}}>Refresh</Text>
                  </View>
                </TouchableHighlight>
              </View>
  				</View>
    		);
      }else{
        this.state.userInfo = this.state.userInfo.replace(/\|/g , ",");
        this.state.userInfo = this.state.userInfo.replace(/\\"/g , "\"");
        var userInfoAsJSON = JSON.parse(this.state.userInfo);
        console.log(userInfoAsJSON.phoneNumber);
        return (
          <View style={styles.container}>
            <View style={{flex:1, flexDirection: 'row', marginLeft: 10, marginRight: 10, paddingLeft: 10, paddingRight: 5, backgroundColor: '#FDF058', height: 90}}>
              <View style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#FDF058'}}>
                <Icon name="ios-contact" size={80} color="#CCCCCC"/>
              </View>
              <View style={{height: 70, backgroundColor: '#FDF058', paddingTop: 10}}>
                <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.name}</Text>
                <Text style={{marginLeft:5}}>Your Phone Number</Text>
                <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.phoneNumber}</Text>
              </View>
            </View>
            <View>
              <TouchableHighlight onPress={() => this.revokeAccount(this)} underlayColor="#FFFFFF">
                <View style={{alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth, height: 40,backgroundColor:'#CCCCCC', marginTop:10, marginLeft: 10, marginRight: 10}}>
                  <Text style={{fontWeight:'800'}}>Disable</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.separator} />
            <View>
              <View style={{flex:1, flexDirection: 'row'}}>
                <TouchableHighlight
                  onPress={this.switchLanguage.bind(this)}
                  underlayColor="#FFFFFF"
                >
                  <View>
                    <View>
                      <Text style={{marginLeft:5}}>Default Language</Text>
                    </View>
                    <View>
                      <Text style={{marginLeft:5}}>
                      {this.state.language}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.separator} />
            
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 2 : 70
  },
  input:{
    height: 50,
    fontSize: 18,
    fontWeight: 'bold',
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
  toolbar: {
    backgroundColor: '#FDF058',
    height: 56,
  },
  languageButton: {
    marginTop: 3,
    marginRight: 5,
    marginLeft: 2,
  },
  separator: {
     height: 1,
     backgroundColor: '#DDDDDD',
     marginTop: 10,
     marginBottom: 10
  },

})
module.exports = Settings;
