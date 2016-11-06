'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid} from 'react-native';
import Button from 'react-native-button';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
       hasAccount:false,
       userInfo:""
    };
  }

  updateBadge(){
    this.props.updateBadge();
  }

  componentDidMount() {
    AsyncStorage.getItem("userInfo").then((result) => {
      if(result != null){
        console.log(result);
        this.setState({
          hasAccount: true,
          userInfo: result
        });
      }
    }).done();
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

  render(){
    if(!this.state.hasAccount){
      return (
				<View style={{flex:1}}>
						 <View style={{marginTop:65, alignItems: 'center',justifyContent:'center', width: this.state.width, height: 50,backgroundColor:'#CCCCCC'}}>
								<Text style={{color:'#ffffff',fontWeight:'800',}} numberOfLines={1}>No registered account to display for now.</Text>
						</View>
						<View style={styles.separator} />
				</View>
  		);
    }else{
      this.state.userInfo = this.state.userInfo.replace(/\|/g , ",");
      this.state.userInfo = this.state.userInfo.replace(/\\"/g , "\"");
      var userInfoAsJSON = JSON.parse(this.state.userInfo);
      console.log(userInfoAsJSON.phoneNumber);
      return (
        <View style={styles.container}>
          <Text style={{marginTop:70, marginLeft:5}}>Your Name</Text>
          <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.name}</Text>
          <Text style={{marginLeft:5}}>Your Phone Number</Text>
          <Text style={{marginLeft:5, fontWeight:'bold'}}>{userInfoAsJSON.phoneNumber}</Text>
          <Button style={styles.button} onPress={() => this.revokeAccount(this)}>Revoke</Button>

        </View>
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

})
module.exports = Settings;
