import React, { Component } from 'react';
import { StyleSheet, PixelRatio, View, TextInput, Text } from 'react-native';

var RCTUIManager = require('NativeModules').UIManager;

var ExpandingTextInput = React.createClass({
  propTypes: TextInput.propTypes,

  getInitialState: function() {
    return {
      height: 30,
      text: ""
    };
  },

  setNativeProps: function(nativeProps) {
    var input  = this.refs.input;
    var hidden = this.refs.hidden;
    input.setNativeProps(nativeProps);
    hidden.setNativeProps(nativeProps);
    if (nativeProps.text !== undefined) {
      this.state.text = nativeProps.text;
    }
  },

  onInputLayout: function(event) {
    var width = event.nativeEvent.layout.width;
    if (this.state.width !== width) {
      this.setState({width: width});
    }
  },

  onHiddenLayout: function(event) {
    var height = event.nativeEvent.layout.height;
    if (height < 30) {
      height = 30;
    }
    if (height > 205) {
      height = 205;
    }
    if (this.state.height !== height) {
      this.setState({height: height});
    }
  },

  onChange: function(event) {
    //console.log('ExpandingTextInput.onChange');
    this.setState({text: event.nativeEvent.text});
    if (this.props.onChange) this.props.onChange(event);
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.value !== this.props.value){
      this.setState({text: nextProps.value})
    }
  },

  render: function() {
    if(this.props.value != this.state.text) {
        setTimeout(()=>{
            this.setState({text:this.props.value});
        },20);
    }
    var passedStyle = this.props.style || {};
    var containerStyle = {};
    var inputStyle = {};
    var hiddenStyle = {};
    // TODO: these don't work beause they are StyleSheet compiled ones
    // if (passedStyle.flex)  containerStyle.flex = passedStyle.flex;
    // if (passedStyle.width) containerStyle.width = passedStyle.width;

    containerStyle.flex = 1;

    inputStyle.height = this.state.height;
    if (this.state.width) {
      hiddenStyle.width = this.state.width;
    }
    return (
      <View style={containerStyle}>
        <TextInput
          {...this.props}
          onChange={this.onChange}
          onLayout={this.onInputLayout}
          multiline={true}
          ref="input"
          style={[styles.input, passedStyle, inputStyle]}
        />
        <Text
         ref="hidden"
         onLayout={this.onHiddenLayout}
         style={[styles.hidden, passedStyle, hiddenStyle]}
        >
          {this.state.text}
        </Text>
      </View>
    );
  }
})

var styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: 10000,  // way off screen
    left: 10000, // way off screen
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'transparent',
    padding: 0,
    fontSize: 15
  },
  input: {
    padding: 0,
    flex: 1,
    fontSize: 15
  }
});

module.exports = ExpandingTextInput;
