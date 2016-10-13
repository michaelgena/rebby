'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableHighlight, ScrollView, PixelRatio, Animated, Navigator, Dimensions, Platform, AsyncStorage, ToolbarAndroid} from 'react-native';
//import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import dismissKeyboard from 'dismissKeyboard';
var ExpandingTextInput = require("./ExpandingTextInput");
var Clipboard = require('react-native-clipboard');
import Radio, {RadioButton} from 'react-native-simple-radio-button';
var KDSocialShare = require('NativeModules').KDSocialShare;

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import Icon from 'react-native-vector-icons/Ionicons';
//import Toggle from 'react-native-toggle';

import realtimeIOS from '../../../RCTRealtimeMessagingIOS';

var RCTRealtimeMessaging;
//RCTRealtimeMessaging = new realtimeIOS();

var dataEN = require("../../data/EN.js");
var dataFR = require("../../data/FR.js");
var jsonEN = dataEN.get();
var jsonFR = dataFR.get();
var keyboardHeight = 0;

var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()};

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

var radio_props = [
  {label: 'EN', value: 0 },
  {label: 'FR', value: 1 }
];

class RebInput extends Component {

  constructor(props) {
    super(props);
    RCTRealtimeMessaging = props.realtimeMessaging;
    let textInputHeight = 0;
    if (Platform.OS === 'android'){
      textInputHeight = 40;
    }
    var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
    this.viewMaxHeight = 125 + textInputHeight;
    if (Platform.OS === 'android'){
      this.viewMaxHeight = 55 + textInputHeight;
    }

    this.viewMaxWidth = Dimensions.get('window').width;
    this.userSelection = {};
    this.state = {
       text:this.props.text != null ? this.props.text : "",
       rebus:this.props.rebus != null ? this.props.rebus : "",
       previousText:this.props.text != null ? this.props.text : "",
       currentText:this.props.text != null ? this.props.text : "",
       rebusArray:[],
       language:this.props.language != null ? this.props.language : 0,
       height: new Animated.Value(this.viewMaxHeight),
       done: false,
       suggest1:{},
       suggest2:{},
       suggest3:{},

       channel: props.channel
    };
  }

  componentDidMount() {
  }

  doSendMessage(message){
    RCTRealtimeMessaging.RTSendMessage(message, this.state.channel);
  }

  _onMessage(messageEvent){
    console.log("received message at RebInput: ["+messageEvent.message+"] on channel [" + messageEvent.channel+"]");
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }

  buttonClicked() {
      dismissKeyboard();
      if(this.state.rebus != ""){
        var reb = {};
        reb.text = this.state.text;
        reb.rebus = this.state.rebus;
        reb.date = Date.now();
        reb.language = this.state.language;

        this.state.rebus = "";

        this.state.text = "";
        this.state.suggest1 = this.state.suggest2 = this.state.suggest3 = "";
        this.userSelection = {};
        /*this.setState({
            done: true
        });*/

        var rebAsString = JSON.stringify(reb);
        rebAsString = rebAsString.replace(/,/g , "|");
        rebAsString = rebAsString.replace(/"/g , "\\\"");

        this.doSendMessage(rebAsString);
        /*AsyncStorage.getItem("myRebs")
        .then((rebs) => {
          if(rebs !== null){
            rebs = rebs.split(",");
            rebs.unshift(rebAsString);
            AsyncStorage.setItem("myRebs", rebs.toString());
          }else{
            var rebs = [];
            rebs.push(rebAsString);
            AsyncStorage.setItem("myRebs", rebs.toString());
          }
        }).done();*/

        AsyncStorage.getItem(this.state.channel)
        .then((rebs) => {
          if(rebs !== null){
            rebs = rebs.split(",");
            rebs.push(rebAsString);
            AsyncStorage.setItem(this.state.channel, rebs.toString());
          }else{
            var rebs = [];
            rebs.push(rebAsString);
            AsyncStorage.setItem(this.state.channel, rebs.toString());
          }
        }).done();
      }
  }

  inputFocused() {
    this.setState({
        done: false
    });
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'ios'){
      Animated.timing(this.state.height, {
          toValue: this.viewMaxHeight - e.endCoordinates.height,
          duration: 200,
        }).start();
    }
    if (Platform.OS === 'android'){
      Animated.timing(this.state.height, {
          toValue: e.endCoordinates.height,
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

  shareOnFacebook() {

    KDSocialShare.shareOnFacebook({
        'text':this.state.rebus,
        'link':'',
        'imagelink':'https://lh3.googleusercontent.com/Dffl5I2uYfuNhNeT2pMkHzJWjn99lz1uox4dEjRtwXA9OO5sO81h-oO8jmSkOFFFj3vwb7r7Z_qpIsoC3EKtTKc1M1MR',
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

  render(){
    if(this.state.done){
      return this.renderShare();
    }else{
      return this.renderWrite();
    }
  }

  renderShare() {
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
              <ScrollView
              onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
              onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
              >
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
            <View style={styles.textInputContainer}>
              <Radio
                radio_props={radio_props}
                initial={this.state.language}
                onPress={(value) => {this.setState({language:value})}}
              />
              <ExpandingTextInput
                value={this.state.text}
                onChangeText={(text) => this.setState({text})}
                controlled={true}
                placeholder="Your text here..."
                autoCorrect={true}
                multiline={true}
                onFocus={this.inputFocused.bind(this)}
              />
            </View>
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
              <ScrollView
              onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
              onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
              >
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
            <View style={styles.textInputContainer}>
              <Radio
                radio_props={radio_props}
                initial={this.state.language}
                onPress={(value) => {this.setState({language:value})}}
              />
              <ExpandingTextInput
                controlled={true}
                placeholder="Your text here..."
                autoCorrect={true}
                multiline={true}
                onFocus={this.inputFocused.bind(this)}
              />
            </View>
            </View>
            <MessageBarAlert ref="alert" />
          </Animated.View>
        );

      }
  }

  renderWrite() {
    if(Platform.OS === 'android'){
      return (
        <Animated.View
          style={{
            height: this.state.height,
            justifyContent: 'flex-start'
          }}
        >
        <View style={styles.container}>

            <ScrollView
            onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
            onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
            >

              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{width:60}}/>
                <View style={{flex:1, flexDirection: 'column',}}>
                  <Text style={styles.rebusAndroid}>{this.state.rebus}</Text>
                  <View style={styles.triangleCorner} />
                </View>
              </View>

            </ScrollView>
            <View style={styles.textPlaceContainer}>
              <View style={styles.textInputContainer}>
                <Radio
                  radio_props={radio_props}
                  initial={this.state.language}
                  onPress={(value) => {this.setState({language:value})}}
                />

                <ExpandingTextInput
                  value={this.state.text}
                  onChangeText={(text) => {this.setState({text});this.generate(this.state.text)}}
                  controlled={true}
                  placeholder="Your text here..."
                  autoCorrect={true}
                  multiline={true}
                  onFocus={this.inputFocused.bind(this)}
                />
                <Button
                  style={styles.sendButton}
                  onPress={this.buttonClicked.bind(this)}
                >
                Done
                </Button>
              </View>
            </View>
          </View>
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
            <ScrollView
            onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
            onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}
            >

            <View style={{flex:1, flexDirection: 'row',}}>
              <View style={{width:60}}/>
              <View style={{flex:1, flexDirection: 'column',}}>
                <Text style={styles.rebus}>{this.state.rebus}</Text>
                <View style={styles.triangleCorner} />
              </View>
            </View>

            </ScrollView>
            <View style={styles.textPlaceContainer}>
              <View style={styles.textInputContainer}>
                <Radio
                  radio_props={radio_props}
                  initial={this.state.language}
                  onPress={(value) => {this.setState({language:value})}}
                />
                <ExpandingTextInput
                  value={this.state.text}
                  onChangeText={(text) => {this.setState({text});this.generate(this.state.text)}}
                  controlled={true}
                  placeholder="Your text here..."
                  autoCorrect={true}
                  multiline={true}
                  onFocus={this.inputFocused.bind(this)}
                />
                <Button
                  style={styles.sendButton}
                  onPress={this.buttonClicked.bind(this)}
                >
                Done
                </Button>
              </View>
              <View style={styles.suggestions}>
                <TouchableHighlight onPress={this.replaceOrAddRebBySuggest1.bind(this)}>
                  <View style={{flex:1, alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 30,backgroundColor:'#FFFFFF',margin: 1}}>
                    <Text numberOfLines={1}>{this.state.suggest1.display}</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.replaceOrAddRebBySuggest2.bind(this)}>
                  <View style={{flex:1, alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 30,backgroundColor:'#FFFFFF',margin: 1}}>
                    <Text numberOfLines={1}>{this.state.suggest2.display}</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.replaceOrAddRebBySuggest3.bind(this)}>
                  <View style={{flex:1, alignItems: 'center',justifyContent:'center', width: this.viewMaxWidth/3, height: 30,backgroundColor:'#FFFFFF',margin: 1}}>
                    <Text numberOfLines={1}>{this.state.suggest3.display}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Animated.View>
      );
    }
  }

  generate(text) {
    this.state.rebus = "";
    this.state.rebusArray = [];
    if(text.length == 0){
      this.state.previousText = "";
      this.state.currentText = "";
      this.state.text = "";

      return "";
    }
    text = text.replace(/ +(?= )/g,'');
    this.state.currentText = text;
    var rebusObj = {};
    var textArray = text.split(" ");
    var i = 0;

    rebusObj.nbSpace = textArray.length - 1;

    while (i < textArray.length) {
        if(textArray[i] == ""){
          i++;
          rebusObj.word = "";
          rebusObj.initialWord = "";
          rebusObj.delta = "";
          rebusObj.left = "";
          rebusObj.prev = "";
          rebusObj.rebus = "";
          continue;
        }
        rebusObj.word = textArray[i];
        rebusObj.initialWord = rebusObj.word;
        rebusObj.i = i;
        var char = rebusObj.word.toLowerCase().charAt(0);

        this.matchEmoji(rebusObj, true);
        if(rebusObj.rebus == undefined || rebusObj.rebus.length == 0){
          //Start to look for a match by removing the first letters
          this.backwardMatch(rebusObj, true);

          var delta = (rebusObj.delta !== undefined) ? rebusObj.delta.length : 0;
          if(delta > 1 && rebusObj.initialWord.length > 3){
            var rebusObjTemp1 = {};
            var rebusObjTemp2 = {};

            rebusObjTemp1.nbSpace = rebusObj.nbSpace;
            rebusObjTemp1.word = rebusObj.initialWord;
            rebusObjTemp2.nbSpace = rebusObj.nbSpace;
            rebusObjTemp2.word = rebusObj.initialWord;

            rebusObjTemp1.prev = rebusObjTemp1.word.charAt(0);
            rebusObjTemp1.word = rebusObjTemp1.word.substring(1,rebusObjTemp1.word.length);
            this.matchEmoji(rebusObjTemp1, false);
            if(rebusObjTemp1.rebus == undefined || rebusObjTemp1.rebus.length == 0){
              this.backwardMatch(rebusObjTemp1, false);
            }
            rebusObjTemp2.prev = rebusObjTemp2.word.substring(0,2);
            rebusObjTemp2.word = rebusObjTemp2.word.substring(2,rebusObjTemp2.word.length);
            this.matchEmoji(rebusObjTemp2, false);
            if(rebusObjTemp2.rebus == undefined || rebusObjTemp2.rebus.length == 0){
              this.backwardMatch(rebusObjTemp2, false);
            }

            if(rebusObjTemp1.rebus !== undefined && rebusObjTemp1.rebus.length > 0 && rebusObjTemp2.rebus !== undefined && rebusObjTemp2.rebus.length > 0){
              var delta1 = (rebusObjTemp1.delta !== undefined) ? rebusObjTemp1.delta.length : 1;
              var delta2 = (rebusObjTemp2.delta !== undefined) ? rebusObjTemp2.delta.length : 2;
              if (delta1 < delta2 && delta1 < delta){
                rebusObj.word = rebusObj.initialWord;
                rebusObj.delta = rebusObjTemp1.delta;
                rebusObj.rebus = rebusObjTemp1.rebus;
                rebusObj.prev = rebusObjTemp1.prev;
                rebusObj.left = rebusObjTemp1.left;
              }
              if (delta2 < delta1 && delta2 < delta){
                rebusObj.word = rebusObj.initialWord;
                rebusObj.delta = rebusObjTemp2.delta;
                rebusObj.rebus = rebusObjTemp2.rebus;
                rebusObj.prev = rebusObjTemp2.prev;
                rebusObj.left = rebusObjTemp2.left;
              }
            }
          }
          //End
          var rebusObjJSON = JSON.parse(JSON.stringify(rebusObj));
          this.state.rebusArray.splice(i,1);
          this.state.rebusArray.push(rebusObjJSON);
          rebusObj.word = "";
          rebusObj.initialWord = "";
          rebusObj.delta = "";
          rebusObj.left = "";
          rebusObj.prev = "";
          rebusObj.rebus = "";
        }else{
          rebusObj.word = "";
          rebusObj.initialWord = "";
          rebusObj.delta = "";
          rebusObj.left = "";
          rebusObj.prev = "";
          rebusObj.rebus = "";
        }

        if(this.state.currentText.length >= this.state.previousText.length){
          var rebusObjJSON = JSON.parse(JSON.stringify(rebusObj));
          this.state.rebusArray.push(rebusObjJSON);
        }
        rebusObj.word = "";
        rebusObj.initialWord = "";
        rebusObj.delta = "";
        rebusObj.left = "";
        rebusObj.prev = "";
        rebusObj.rebus = "";

      i++;
    }

    for(var r=0; r<this.state.rebusArray.length; r++){
      if(this.state.rebus !== ""){
          this.state.rebus += "\u2000";
      }
      this.state.rebus += this.buildRebus(this.state.rebusArray[r]);
    }
    this.state.previousText = text;

    //this.state.rebus.replaceAll(" ", "\u2000");
    return this.state.rebus;
  }

  buildRebus(rebusArray){

    //if the user chose another rebus then replace the standard by it
    if(this.userSelection !== undefined  && this.userSelection !== null){
      var userSelection = this.userSelection[rebusArray.word];
      console.log("userSelection:"+JSON.stringify(userSelection));
      if(userSelection !== undefined && userSelection !== null){
        rebusArray = userSelection;
      }
    }

    var rebus = "";
    if(rebusArray.prev !== undefined && rebusArray.prev.length>0){
      rebus += rebusArray.prev;
    }
    if(rebusArray.rebus !== undefined && rebusArray.rebus.length>0){
      rebus += rebusArray.rebus;
    }else{
      rebus += rebusArray.word;
    }
    if(rebusArray.left !== undefined && rebusArray.left.length>0){
      if(rebusArray.delta !== undefined && rebusArray.delta.length>0){
        rebus += "-"+rebusArray.delta+"+"+rebusArray.left;
      }else{
        rebus += rebusArray.left;
      }
    }else if(rebusArray.delta !== undefined && rebusArray.delta.length>0){
      rebus += "-"+rebusArray.delta;
    }
    return rebus;
  }

  matchEmoji(obj, autoSave) {
    if(obj.word.length == 0 || obj.word.toLowerCase().charAt(0) == ""){
      return obj;
    }
    var char = obj.word.toLowerCase().latinize().charAt(0);
    if(/^[A-Za-z\u00C0-\u017F]+$/.test(char)){
      char = char.latinize();
      var foundMatch = false;
      var json = this.state.language == 1 ? jsonFR : jsonEN;
      for(var j = 0; j < json[char].length; j++){
        if(json[char][j].name.startsWith(obj.word.toLowerCase().latinize()) == true){
            //are we building the rebus on the go
            obj.rebus = json[char][j].value;
            var delta = json[char][j].name.replace(obj.word.toLowerCase().latinize(), "");
            if(delta.length>0){
              obj.delta = delta;
            }
            if(autoSave){
              var rebusObjJSON = JSON.parse(JSON.stringify(obj));
              if(this.state.rebusArray.length>0 && this.state.rebusArray[this.state.rebusArray.length-1].nbSpace == obj.nbSpace && this.state.currentText.length >= this.state.previousText.length){
                this.state.rebusArray.splice(obj.i,1);
                this.state.rebusArray.splice(obj.i, 0, rebusObjJSON);
              }else{
                this.state.rebusArray.push(rebusObjJSON);
              }
            }

            //build the suggestions
            this.state.suggest1 = this.state.suggest2 = this.state.suggest3 = "";
            if(json[char].length>j+1){
              if(json[char][j+1].name.startsWith(obj.word.toLowerCase().latinize()) == true){
                obj.rebus = json[char][j+1].value;
                obj.delta = "";
                var delta = json[char][j+1].name.replace(obj.word.toLowerCase().latinize(), "");
                if(delta.length>0){
                  obj.delta = delta;
                }
                this.state.suggest1 = clone(obj);
                this.state.suggest1.display = this.buildRebus(obj);
              }
            }
            if(json[char].length>j+2){
              if(json[char][j+2].name.startsWith(obj.word.toLowerCase().latinize()) == true){
                obj.rebus = json[char][j+2].value;
                obj.delta = "";
                var delta = json[char][j+2].name.replace(obj.word.toLowerCase().latinize(), "");
                if(delta.length>0){
                  obj.delta = delta;
                }
                this.state.suggest2 = clone(obj);
                this.state.suggest2.display = this.buildRebus(obj);
              }
            }
            if(json[char].length>j+3){
              if(json[char][j+3].name.startsWith(obj.word.toLowerCase().latinize()) == true){
                obj.rebus = json[char][j+3].value;
                obj.delta = "";
                var delta = json[char][j+3].name.replace(obj.word.toLowerCase().latinize(), "");
                if(delta.length>0){
                  obj.delta = delta;
                }
                this.state.suggest3 = clone(obj);
                this.state.suggest3.display = this.buildRebus(obj);
              }
            }
            break;
        }
      }
    }
    return obj;
  }

  backwardMatch(obj, autoSave){
    obj.left = "";
    obj.initialWord = obj.word;
    for(var n=obj.word.length-1; n>0; n--){
      obj.left = obj.word.charAt(n)+obj.left;
      obj.word = obj.word.substring(0,n);
      this.matchEmoji(obj, autoSave);
      if(obj.rebus !== undefined && obj.rebus.length > 0){
        break;
      }
    }
    return obj;
  }

  replaceOrAddReb(){
  }

  replaceOrAddRebBySuggest1(){
    this.replaceOrAddRebBySuggest(this.state.suggest1);
  }
  replaceOrAddRebBySuggest2(){
    this.replaceOrAddRebBySuggest(this.state.suggest2);
  }
  replaceOrAddRebBySuggest3(){
    this.replaceOrAddRebBySuggest(this.state.suggest3);
  }

  replaceOrAddRebBySuggest(obj){
    var rebusObjJSON = JSON.parse(JSON.stringify(obj));
    //console.log("reb:"+rebusObjJSON);
    if(this.state.rebusArray.length>0 && this.state.rebusArray[this.state.rebusArray.length-1].nbSpace == obj.nbSpace && this.state.currentText.length >= this.state.previousText.length){
      this.state.rebusArray.splice(obj.i,1);
      this.state.rebusArray.splice(obj.i, 0, rebusObjJSON);
    }else{
      this.state.rebusArray.push(rebusObjJSON);
    }
    var rebus = "";
    for(var r=0; r<this.state.rebusArray.length; r++){
      if(rebus !== ""){
          rebus += " ";
      }
      rebus += this.buildRebus(this.state.rebusArray[r]);
    }
    this.setState({
        rebus: rebus
    });

    //save user's selection for later
    this.userSelection[obj.word] = rebusObjJSON;
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginBottom:20
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
    height: 30
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
  info:{
    backgroundColor : '#007bff'
  },
  toolbar: {
    backgroundColor: '#FDF058',
    height: 56,
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
})

export default RebInput;
